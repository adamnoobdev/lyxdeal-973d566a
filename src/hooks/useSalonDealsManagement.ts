
import { useState, useEffect, useRef, useCallback } from "react";
import { Deal } from "@/components/admin/types";
import { toast } from "sonner";
import { 
  fetchSalonDeals, 
  deleteSalonDeal, 
  updateSalonDeal, 
  toggleDealActiveStatus,
  DealUpdateValues 
} from "@/utils/dealApiUtils";

export const useSalonDealsManagement = (salonId: string | undefined) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const isLoadingDeals = useRef(false);
  const isUpdatingDeal = useRef(false);
  const isDeletingDeal = useRef(false);
  const isMountedRef = useRef(true);
  const previousSalonId = useRef<string | undefined>(undefined);
  const loadAttempts = useRef(0);

  const loadSalonDeals = useCallback(async () => {
    // Förhindra dubbla anrop och kontrollera att komponenten fortfarande är monterad
    if (isLoadingDeals.current || !isMountedRef.current || !salonId) {
      console.log("Skipping loadSalonDeals: already loading, unmounted, or no salonId");
      return;
    }
    
    // Begränsa antalet laddningsförsök för att undvika potentiella oändliga loopar
    if (loadAttempts.current > 3) {
      console.log("Too many load attempts, skipping");
      return;
    }
    
    loadAttempts.current++;
    
    try {
      console.log(`Loading salon deals for salon ID: ${salonId}, attempt: ${loadAttempts.current}`);
      isLoadingDeals.current = true;
      setIsLoading(true);
      setError(null);
      
      const fetchedDeals = await fetchSalonDeals(salonId);
      
      if (isMountedRef.current) {
        console.log(`Successfully loaded ${fetchedDeals.length} deals for salon ${salonId}`);
        setDeals(fetchedDeals);
        // Återställ försöksräknaren vid framgång
        loadAttempts.current = 0;
      }
    } catch (err: any) {
      console.error("Error fetching salon deals:", err);
      if (isMountedRef.current) {
        setError(err.message || "Ett fel uppstod");
        toast.error("Ett fel uppstod när erbjudanden skulle hämtas");
      }
    } finally {
      isLoadingDeals.current = false;
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [salonId]);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Endast ladda om erbjudanden om salonId har ändrats
    if (salonId && previousSalonId.current !== salonId) {
      console.log(`SalonId changed from ${previousSalonId.current} to ${salonId}, reloading deals`);
      previousSalonId.current = salonId;
      loadSalonDeals();
    }
    
    return () => {
      console.log("useSalonDealsManagement unmounting");
      isMountedRef.current = false;
    };
  }, [salonId, loadSalonDeals]);

  const handleDeleteDeal = useCallback(async () => {
    if (!deletingDeal || !isMountedRef.current || isDeletingDeal.current) {
      console.log("Skipping delete: no deal, unmounted, or already deleting");
      return;
    }

    try {
      isDeletingDeal.current = true;
      console.log(`Deleting deal with ID: ${deletingDeal.id}`);
      
      await deleteSalonDeal(deletingDeal.id);
      toast.success("Erbjudandet har tagits bort");
      
      if (isMountedRef.current) {
        // Uppdatera state lokalt för att undvika ytterligare API-anrop
        setDeals(prevDeals => prevDeals.filter(deal => deal.id !== deletingDeal.id));
        setDeletingDeal(null);
      }
    } catch (err: any) {
      console.error("Error deleting deal:", err);
      toast.error("Ett fel uppstod när erbjudandet skulle tas bort");
    } finally {
      isDeletingDeal.current = false;
    }
  }, [deletingDeal]);

  const handleUpdate = useCallback(async (values: any) => {
    if (!editingDeal || !isMountedRef.current || isUpdatingDeal.current) {
      console.log("Skipping update: no deal, unmounted, or already updating");
      return;
    }

    try {
      isUpdatingDeal.current = true;
      console.log(`Updating deal with ID: ${editingDeal.id}`);
      
      const updateValues: DealUpdateValues = {
        title: values.title,
        description: values.description,
        imageUrl: values.imageUrl,
        originalPrice: parseInt(values.originalPrice) || 0,
        discountedPrice: values.is_free ? 0 : parseInt(values.discountedPrice) || 0,
        category: values.category,
        city: values.city,
        featured: values.featured,
        is_free: values.is_free || false,
        is_active: values.is_active !== undefined ? values.is_active : editingDeal.is_active,
        quantity: parseInt(values.quantity) || 10,
        expirationDate: values.expirationDate,
        salon_id: editingDeal.salon_id
      };
      
      console.log("Updating deal with values:", updateValues);
      await updateSalonDeal(editingDeal.id, updateValues);
      
      if (isMountedRef.current) {
        toast.success("Erbjudandet har uppdaterats");
        
        // Uppdatera det redigerade erbjudandet lokalt
        const updatedDeal = { 
          ...editingDeal, 
          title: values.title,
          description: values.description,
          image_url: values.imageUrl,
          original_price: parseInt(values.originalPrice) || 0,
          discounted_price: values.is_free ? 0 : parseInt(values.discountedPrice) || 0,
          category: values.category,
          city: values.city,
          featured: values.featured,
          is_free: values.is_free || false,
          is_active: values.is_active !== undefined ? values.is_active : editingDeal.is_active,
          quantity_left: parseInt(values.quantity) || 10,
          expiration_date: values.expirationDate.toISOString()
        };
        
        setDeals(prevDeals => prevDeals.map(deal => 
          deal.id === editingDeal.id ? updatedDeal : deal
        ));
        setEditingDeal(null);
      }
    } catch (err: any) {
      console.error("Error updating deal:", err);
      if (isMountedRef.current) {
        toast.error("Ett fel uppstod när erbjudandet skulle uppdateras");
      }
    } finally {
      isUpdatingDeal.current = false;
    }
  }, [editingDeal]);

  const handleToggleActive = useCallback(async (deal: Deal) => {
    if (!isMountedRef.current) return;
    
    try {
      console.log(`Toggling active state for deal ID: ${deal.id}, current: ${deal.is_active}`);
      await toggleDealActiveStatus(deal.id, !deal.is_active);
      
      if (isMountedRef.current) {
        toast.success(`Erbjudandet är nu ${!deal.is_active ? 'aktivt' : 'inaktivt'}`);
        
        // Uppdatera erbjudandet lokalt
        setDeals(prevDeals => prevDeals.map(d => 
          d.id === deal.id ? { ...d, is_active: !d.is_active } : d
        ));
      }
    } catch (err: any) {
      console.error("Error toggling deal active status:", err);
      if (isMountedRef.current) {
        toast.error("Ett fel uppstod när erbjudandets status skulle ändras");
      }
    }
  }, []);

  // Filtrera erbjudanden efter aktiva/inaktiva
  const activeDeals = deals.filter(deal => deal.is_active);
  const inactiveDeals = deals.filter(deal => !deal.is_active);
  
  return {
    deals,
    activeDeals,
    inactiveDeals,
    isLoading,
    error,
    editingDeal,
    deletingDeal,
    setEditingDeal,
    setDeletingDeal,
    handleDelete: handleDeleteDeal,
    handleUpdate,
    handleToggleActive,
  };
};
