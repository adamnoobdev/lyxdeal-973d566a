
export interface SalonData {
  id: number | null;
  name: string;
  address: string | null;
  phone: string | null;
}

/**
 * Creates a default salon data object with fallback values
 */
export const createDefaultSalonData = (cityName?: string | null): SalonData => ({
  id: null,
  name: cityName ? `Salong i ${cityName}` : 'Okänd salong',
  address: cityName || null,
  phone: null
});
