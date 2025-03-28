
import mapboxgl from 'mapbox-gl';

/**
 * Convert an address to coordinates using Mapbox Geocoding API
 * 
 * @param address The address to geocode
 * @param mapboxToken The Mapbox access token
 * @param options Optional parameters for the geocoding request
 * @returns Promise resolving to coordinates or null if not found
 */
export const getCoordinates = async (
  address: string, 
  mapboxToken: string,
  options: {
    country?: string;
    limit?: number;
  } = {}
): Promise<[number, number] | null> => {
  try {
    if (!mapboxToken || !address || address.trim() === '') {
      console.error('Missing required parameters for geocoding', { hasToken: !!mapboxToken, address });
      return null;
    }
    
    // Default options
    const { 
      country = 'se', // Default to Sweden
      limit = 1 
    } = options;
    
    // Clean and encode the address
    const cleanAddress = address.trim().replace(/\s+/g, ' ');
    const encodedAddress = encodeURIComponent(cleanAddress);
    
    // Build the URL with parameters
    const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json`);
    url.searchParams.append('access_token', mapboxToken);
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('country', country);
    
    console.log('Geocoding request URL:', url.toString());
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error('Geocoding API error:', response.status, response.statusText);
      throw new Error(`Geocoding request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Geocoding response features:', data.features ? data.features.length : 0);
    
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      console.log('Found coordinates:', [lng, lat], 'for address:', cleanAddress);
      return [lng, lat] as [number, number];
    } else {
      console.warn('No geocoding results found for address:', cleanAddress);
      return null;
    }
  } catch (error) {
    console.error('Error during geocoding:', error);
    return null;
  }
};

/**
 * Validate if an address is likely to be geocodable
 * 
 * @param address The address to validate
 * @returns Whether the address is likely valid
 */
export const isValidAddressFormat = (address: string): boolean => {
  if (!address || address.trim() === '') return false;
  
  // Basic validation - should contain at least numbers and street name
  // and be of reasonable length
  const cleanAddress = address.trim();
  return cleanAddress.length >= 5 && /\d+/.test(cleanAddress);
};
