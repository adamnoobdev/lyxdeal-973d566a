import { useState, useEffect } from 'react';
import { normalizeAddress, isValidAddressFormat } from '@/utils/mapbox';

interface UseMapAddressProps {
  address: string;
  city?: string;
}

export const useMapAddress = ({ address, city }: UseMapAddressProps) => {
  const [normalizedAddress, setNormalizedAddress] = useState<string>('');
  const [formattedAddress, setFormattedAddress] = useState<string>('');
  const [isValidAddress, setIsValidAddress] = useState<boolean>(true);

  // Improved address formatting for geocoding
  useEffect(() => {
    const getFormattedAddress = () => {
      if (!address) return city || '';
      
      // Standardize address format
      let formattedAddress = address.trim();
      
      // If the address already contains the city, use it as is
      if (city && formattedAddress.toLowerCase().includes(city.toLowerCase())) {
        return formattedAddress;
      }
      
      // Otherwise, add the city if available
      return city ? `${formattedAddress}, ${city}` : formattedAddress;
    };

    const formatted = getFormattedAddress();
    setFormattedAddress(formatted);
    setNormalizedAddress(normalizeAddress(formatted));
    setIsValidAddress(formatted.trim() !== '');

    console.log("useMapAddress formatting:", { 
      original: address,
      city,
      formatted,
      normalized: normalizeAddress(formatted)
    });
  }, [address, city]);

  return {
    normalizedAddress,
    formattedAddress,
    isValidAddress
  };
};
