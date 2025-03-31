
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export const DatabaseAccessTester = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<Record<string, any>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const testTables = async () => {
    setIsLoading(true);
    const tests: Record<string, any> = {};
    
    // Kontrollera autentisering
    const { data: session } = await supabase.auth.getSession();
    const loggedIn = !!session?.session?.user;
    setIsAuthenticated(loggedIn);
    tests.authentication = {
      success: true,
      status: loggedIn ? 'Inloggad' : 'Ej inloggad (anonym)',
      user: loggedIn ? session.session.user.email : 'Anonym användare'
    };
    
    // Test deals table
    try {
      const { count, error } = await supabase
        .from("deals")
        .select("*", { count: "exact", head: true });
      
      tests.deals = {
        success: !error,
        count: count || 0,
        error: error ? error.message : null
      };
    } catch (e) {
      tests.deals = { success: false, error: e instanceof Error ? e.message : String(e) };
    }
    
    // Test salons table
    try {
      const { count, error } = await supabase
        .from("salons")
        .select("*", { count: "exact", head: true });
      
      tests.salons = {
        success: !error,
        count: count || 0,
        error: error ? error.message : null
      };
    } catch (e) {
      tests.salons = { success: false, error: e instanceof Error ? e.message : String(e) };
    }
    
    // Test a specific salon
    try {
      const { data, error } = await supabase
        .from("salons")
        .select("*")
        .eq("id", 31) // Specifikt för din nuvarande situation
        .maybeSingle();
      
      tests.specificSalon = {
        success: !error,
        found: !!data,
        data: data,
        error: error ? error.message : null
      };
    } catch (e) {
      tests.specificSalon = { success: false, error: e instanceof Error ? e.message : String(e) };
    }
    
    // Test direct fetch
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/salons?id=eq.31&select=*`;
      const response = await fetch(url, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      tests.directFetch = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        found: Array.isArray(data) && data.length > 0,
        data: data
      };
    } catch (e) {
      tests.directFetch = { success: false, error: e instanceof Error ? e.message : String(e) };
    }
    
    setResults(tests);
    setIsLoading(false);
  };
  
  useEffect(() => {
    testTables();
  }, []);
  
  return (
    <div className="border rounded-md p-4 bg-background mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Databas Åtkomsttest</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {isLoading ? (
        <p className="text-sm text-muted-foreground mt-2">Testar databastillgång...</p>
      ) : (
        <>
          <div className="flex items-center gap-2 mt-2">
            <div className={`h-2 w-2 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-amber-500'}`} />
            <p className="text-sm font-medium">
              Status: {isAuthenticated ? 'Inloggad' : 'Ej inloggad (anonym)'}
            </p>
          </div>
          
          {isExpanded && (
            <div className="mt-4 space-y-4">
              {Object.entries(results).map(([key, result]) => (
                <div key={key} className="border rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {result.success ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    <h4 className="font-medium capitalize">{key}</h4>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    {Object.entries(result).map(([rKey, rValue]) => {
                      if (rKey === 'data') return null;
                      return (
                        <p key={rKey} className="text-muted-foreground">
                          <span className="font-medium capitalize">{rKey}:</span>{' '}
                          {typeof rValue === 'boolean' 
                            ? rValue ? 'Ja' : 'Nej'
                            : String(rValue)
                          }
                        </p>
                      );
                    })}
                  </div>
                  
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer">
                        Visa data
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
              
              <Alert variant="warning" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Om åtkomst till salons-tabellen misslyckas, kontrollera Row Level Security-policyerna 
                  i din Supabase-databas. Din nya policy "Allow public read access" borde ha löst 
                  läsåtkomstproblemet för anonyma användare.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4">
                <Button onClick={testTables} size="sm">
                  Testa igen
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
