
import mapboxgl from 'mapbox-gl';

/**
 * Convert an address to coordinates using Mapbox Geocoding API
 */
export const getCoordinates = async (
  address: string, 
  mapboxToken: string
): Promise<[number, number] | null> => {
  try {
    if (!mapboxToken) return null;
    
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${mapboxToken}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Kunde inte hitta koordinater för den angivna adressen');
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return [lng, lat] as [number, number];
    } else {
      throw new Error('Inga resultat hittades för adressen');
    }
  } catch (error) {
    console.error('Fel vid geokodning:', error);
    return null;
  }
};
