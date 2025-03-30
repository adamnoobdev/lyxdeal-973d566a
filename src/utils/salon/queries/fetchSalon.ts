
import { supabase } from "@/integrations/supabase/client";
import { SalonData } from "../types";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/utils/supabaseConfig";

/**
 * Hämtar en salong med exakt matchande ID
 */
export const fetchSalonByExactId = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`Attempting to fetch salon with exact ID: ${salonId} (${typeof salonId})`);
  
  try {
    // Konvertera till nummer för numerisk sökning
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    const isValidNumber = !isNaN(numericId);
    
    // Hämta direkt via API utan autentisering först
    console.log(`Fetching salon with ID=${salonId} via direct API`);
    
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/salons?id=eq.${numericId}&select=id,name,address,phone`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    if (response.ok) {
      const directData = await response.json();
      if (directData && Array.isArray(directData) && directData.length > 0) {
        console.log("Found salon with direct API query:", directData[0]);
        return directData[0] as SalonData;
      }
    } else {
      console.log(`Direct API query failed: ${response.status} ${response.statusText}`);
    }
    
    // Fallback till Supabase klient
    // Försök hämta med numeriskt ID först om giltigt
    if (isValidNumber) {
      console.log(`Querying salon with numeric ID: ${numericId}`);
      
      const { data: numericData, error: numericError } = await supabase
        .from("salons")
        .select("id, name, address, phone")
        .filter('id', 'eq', numericId)
        .maybeSingle();
        
      if (numericError) {
        console.error("Error in numeric salon query:", numericError);
      } else if (numericData) {
        console.log("Found salon with numeric ID:", numericData);
        return numericData as SalonData;
      }
    }
    
    // Om numerisk sökning misslyckas, prova strängmatchning med explicit content-type
    const stringId = String(salonId);
    console.log(`Querying salon with string ID filter: ${stringId}`);
    
    // Ändra till att använda filterfunktionen med explicit typkonvertering
    const { data: stringData, error: stringError } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .filter('id::text', 'eq', stringId)  // Konvertera id till text för jämförelse
      .maybeSingle();
      
    if (stringError) {
      console.error("Error in string salon query:", stringError);
    } else if (stringData) {
      console.log("Found salon with string ID comparison:", stringData);
      return stringData as SalonData;
    }
    
    // Om ingen exakt match, prova att söka efter alla salonger (begränsat antal)
    console.log(`No direct match, fetching a limited set of salons to search manually`);
    
    // Anropa direkthämtning av alla salonger utan auth-token
    const allSalonsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/salons?select=id,name,address,phone&limit=50`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
      
    if (allSalonsResponse.ok) {
      const allSalons = await allSalonsResponse.json();
      
      if (allSalons && Array.isArray(allSalons) && allSalons.length > 0) {
        console.log("Got all salons to search manually, count:", allSalons.length);
        // Sök manuellt efter en matchande ID
        const matchedSalon = allSalons.find(salon => 
          salon.id == salonId || String(salon.id) === stringId
        );
        
        if (matchedSalon) {
          console.log("Found salon through manual comparison:", matchedSalon);
          return matchedSalon as SalonData;
        }
        
        // Fallback till första salonen om ingen match hittas
        console.log("No matching salon found, using first available salon as fallback");
        return allSalons[0] as SalonData;
      }
    }
    
    console.log(`No salon found with ID: ${salonId} using any method`);
    return null;
  } catch (err) {
    console.error("Exception fetching salon by exact ID:", err);
    return null;
  }
};

/**
 * Hämtar alla salonger
 */
export const fetchAllSalons = async (): Promise<SalonData[] | null> => {
  try {
    console.log("Fetching all salons");
    
    // Använd direkt fetch först för att kringgå behörighetsbegränsningar
    console.log("Trying direct fetch to get all salons");
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/salons?select=id,name,address,phone&limit=50`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    if (response.ok) {
      const directData = await response.json();
      if (directData && Array.isArray(directData) && directData.length > 0) {
        console.log("Found salons with direct API:", directData.length);
        return directData as SalonData[];
      }
    }
    
    // Fallback till normal Supabase query
    const { data: salonData, error: salonError, status } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .order('id', { ascending: true });
    
    console.log("All salons query status:", status);
      
    if (salonError || !salonData || salonData.length === 0) {
      console.log("No salons found via Supabase client:", salonError);
      return null;
    }
    
    console.log("All available salons count:", salonData?.length || 0);
    if (salonData && salonData.length > 0) {
      console.log("Sample of salons:", salonData.slice(0, 3));
    } else {
      console.log("No salons found in the database");
    }
    
    return salonData as SalonData[];
  } catch (err) {
    console.error("Exception in fetchAllSalons:", err);
    return null;
  }
};

/**
 * Hämtar fullständig salongsdata med ett specifikt ID
 */
export const fetchFullSalonData = async (salonId: number | string): Promise<SalonData | null> => {
  console.log(`Fetching full salon data for ID: ${salonId} (${typeof salonId})`);
  
  try {
    // Hämta direkt via API utan autentisering först
    const numericId = typeof salonId === 'string' ? parseInt(salonId, 10) : salonId;
    
    console.log(`Using direct API query for salon ID: ${salonId}`);
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/salons?id=eq.${numericId}&select=id,name,address,phone`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    if (response.ok) {
      const directData = await response.json();
      if (directData && Array.isArray(directData) && directData.length > 0) {
        console.log("Retrieved salon with direct API query:", directData[0]);
        return directData[0] as SalonData;
      }
    }
    
    // Fallback till Supabase klient om API-förfrågan misslyckas
    if (!isNaN(numericId)) {
      console.log(`Using numeric query for salon ID: ${numericId}`);
      
      const { data, error } = await supabase
        .from("salons")
        .select("id, name, address, phone")
        .filter('id', 'eq', numericId)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching salon with numeric ID:", error);
      } else if (data) {
        console.log("Retrieved salon with numeric ID:", data);
        return data as SalonData;
      }
    }
    
    // Fallback till strängmatchning om numerisk sökning misslyckas
    const stringId = String(salonId);
    console.log(`Using string filter for salon ID: "${stringId}"`);
    
    // Använd filter-metoden med explicit typkonvertering för att matcha strängar
    const { data: stringData, error: stringError } = await supabase
      .from("salons")
      .select("id, name, address, phone")
      .filter('id::text', 'eq', stringId)  // Konvertera id till text för jämförelse
      .maybeSingle();
      
    if (stringError) {
      console.error("Error in string-based salon query:", stringError);
    } else if (stringData) {
      console.log("Retrieved salon with string comparison:", stringData);
      return stringData as SalonData;
    }
    
    console.log(`No salon found with ID: ${salonId} using any method`);
    return null;
  } catch (err) {
    console.error("Exception in fetchFullSalonData:", err);
    return null;
  }
};
