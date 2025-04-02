
export interface SalonData {
  id: number | null;
  name: string;
  address: string | null;
  phone: string | null;
  city?: string | null;
  email?: string;
  created_at?: string;
  user_id?: string | null;
  role?: string;
  terms_accepted?: boolean;
  privacy_accepted?: boolean;
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
