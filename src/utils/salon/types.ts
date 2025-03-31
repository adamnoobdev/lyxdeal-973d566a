
export interface SalonData {
  id: number | null;
  name: string;
  address: string | null;
  phone: string | null;
  city?: string | null;
}

/**
 * Creates a default salon data object with fallback values
 */
export const createDefaultSalonData = (cityName?: string | null): SalonData => {
  const address = cityName ? `${cityName} centrum` : null;
  
  return {
    id: null,
    name: cityName ? `Salong i ${cityName}` : 'Okänd salong',
    address: address,
    phone: null,
    city: cityName
  };
};
