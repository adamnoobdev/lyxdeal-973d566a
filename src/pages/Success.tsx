
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Deal } from "@/types/deal";
import { CheckCircle2, Copy, Home } from "lucide-react";

interface SuccessState {
  isLoading: boolean;
  deal: Deal | null;
  discountCode: string | null;
  error: string | null;
}

export default function Success() {
  const [searchParams] = useSearchParams();
  const dealIdString = searchParams.get("deal_id");
  const code = searchParams.get("code");
  const [state, setState] = useState<SuccessState>({
    isLoading: true,
    deal: null,
    discountCode: code,
    error: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!dealIdString) {
          setState(prev => ({ ...prev, isLoading: false, error: "Ingen deal ID hittades" }));
          return;
        }

        const dealId = parseInt(dealIdString, 10);
        if (isNaN(dealId)) {
          setState(prev => ({ ...prev, isLoading: false, error: "Ogiltigt deal ID" }));
          return;
        }
        
        // Hämta detaljer om dealen
        const { data: deal, error: dealError } = await supabase
          .from("deals")
          .select(`
            id, 
            title, 
            description,
            image_url,
            category,
            city,
            salon_id,
            salons(name, address, phone)
          `)
          .eq("id", dealId)
          .single();
        
        if (dealError) {
          throw new Error("Kunde inte hämta information om erbjudandet");
        }
        
        // Om vi inte redan har en rabattkod från URL:en, hämta den senast tilldelade koden
        let discountCode = code;
        if (!discountCode) {
          const { data: codeData, error: codeError } = await supabase
            .from("discount_codes")
            .select("code")
            .eq("deal_id", dealId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
          
          if (!codeError && codeData) {
            discountCode = codeData.code;
          }
        }
        
        setState({
          isLoading: false,
          deal: deal as unknown as Deal,
          discountCode,
          error: null,
        });
      } catch (error) {
        console.error("Error loading success data:", error);
        setState(prev => ({
          ...prev, 
          isLoading: false,
          error: error instanceof Error ? error.message : "Ett fel uppstod"
        }));
      }
    };
    
    loadData();
  }, [dealIdString, code]);

  const handleCopyCode = () => {
    if (state.discountCode) {
      navigator.clipboard.writeText(state.discountCode);
      toast.success("Rabattkoden har kopierats!");
    }
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-sm">
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse"></div>
            <div className="h-6 w-48 bg-gray-100 animate-pulse rounded"></div>
            <div className="h-4 w-64 bg-gray-100 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-sm text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-4">
            Något gick fel
          </h1>
          <p className="text-gray-600 mb-6">{state.error}</p>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Gå till startsidan
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-sm">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tack för ditt intresse!
            </h1>
            <p className="mt-2 text-gray-600">
              {state.deal?.title && `Du har nu säkrat "${state.deal.title}"`}
            </p>
          </div>
          
          {state.discountCode && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Din rabattkod (giltig i 72 timmar)</p>
              <div className="flex items-center justify-center gap-3">
                <code className="font-mono text-xl font-bold tracking-wide">
                  {state.discountCode}
                </code>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={handleCopyCode}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Rabattkoden har även skickats till din e-post. Ta med koden när du besöker salongen.
              </p>
              <p className="mt-2 text-sm text-orange-600 font-medium">
                OBS: Rabattkoden är giltig i endast 72 timmar.
              </p>
            </div>
          )}
          
          <div className="pt-6 space-y-3">
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Gå till startsidan
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
