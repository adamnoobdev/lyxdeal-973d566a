
import { useState, useRef } from 'react';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { toast } from 'sonner';
import { AddressParts } from './types';
import { parseAddressParts } from './addressUtils';

export const useAddressSearch = (
  defaultValue: string, 
  onChange: (value: string, parts?: AddressParts) => void
) => {
  const { mapboxToken, isLoading: isTokenLoading } = useMapboxToken();
  const [inputValue, setInputValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(!!defaultValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchAddress = async (query: string) => {
    if (!mapboxToken || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`);
      url.searchParams.append('access_token', mapboxToken);
      url.searchParams.append('country', 'se');
      url.searchParams.append('language', 'sv');
      url.searchParams.append('limit', '5');
      url.searchParams.append('types', 'address,poi,postcode,place');

      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.features) {
        setSuggestions(data.features);
      }
    } catch (error) {
      console.error('Error searching for address:', error);
      toast.error('Kunde inte söka efter adress');
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedAddress(null);
    setIsValid(false);
    
    // Reset search timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Delay search to avoid too many API calls
    timeoutRef.current = setTimeout(() => {
      searchAddress(value);
    }, 400);
    
    // Update parent component with raw text value
    onChange(value);
  };

  const handleSelectSuggestion = (feature: any) => {
    // If null is passed, just close the suggestions without selection
    if (feature === null) {
      setSuggestions([]);
      return;
    }
    
    const place = feature.place_name;
    setInputValue(place);
    setSelectedAddress(place);
    setSuggestions([]);
    setIsValid(true);
    
    // Extract address parts
    const addressParts = parseAddressParts(feature);
    
    // Send both text value and structured parts to parent
    onChange(place, addressParts);
  };

  return {
    inputValue,
    setInputValue,
    suggestions,
    setSuggestions,
    isSearching,
    selectedAddress,
    isValid,
    isTokenLoading,
    mapboxToken,
    handleInputChange,
    handleSelectSuggestion
  };
};
