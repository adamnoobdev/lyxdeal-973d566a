
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { Loader2, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';

interface MapboxAddressInputProps {
  defaultValue?: string;
  onChange: (value: string, parts?: AddressParts) => void;
  id?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: boolean;
}

export interface AddressParts {
  street?: string;
  postalCode?: string;
  city?: string;
  coordinates?: [number, number];
}

export const MapboxAddressInput = ({
  defaultValue = '',
  onChange,
  id,
  placeholder = 'Sök adress...',
  required,
  className,
  error
}: MapboxAddressInputProps) => {
  const { mapboxToken, isLoading: isTokenLoading } = useMapboxToken();
  const [inputValue, setInputValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // När komponenten renderas första gången, sätt initialvärdet
    if (defaultValue) {
      setInputValue(defaultValue);
      setSelectedAddress(defaultValue);
      setIsValid(true);
    }
  }, [defaultValue]);

  useEffect(() => {
    // Lägg till lyssnare för att stänga förslag när man klickar utanför
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    
    // Återställ timeout för sökning
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Fördröj sökningen för att undvika för många API-anrop
    timeoutRef.current = setTimeout(() => {
      searchAddress(value);
    }, 400);
    
    // Uppdatera parent component med råtextvärde
    onChange(value);
  };

  const parseAddressParts = (feature: any): AddressParts => {
    const place = feature.place_name;
    const coordinates = feature.center as [number, number];
    const context = feature.context || [];
    
    // Extrahera delar av adressen
    let street = feature.text || '';
    let postalCode = '';
    let city = '';
    
    if (feature.address) {
      street = `${feature.address} ${street}`;
    }
    
    // Hitta postnummer och stad från context
    context.forEach((item: any) => {
      if (item.id.startsWith('postcode')) {
        postalCode = item.text;
      } else if (item.id.startsWith('place')) {
        city = item.text;
      }
    });
    
    return {
      street: street,
      postalCode: postalCode,
      city: city,
      coordinates: coordinates
    };
  };

  const handleSelectSuggestion = (feature: any) => {
    const place = feature.place_name;
    setInputValue(place);
    setSelectedAddress(place);
    setSuggestions([]);
    setIsValid(true);
    
    // Extrahera adressdelar
    const addressParts = parseAddressParts(feature);
    
    // Skicka både textvärde och strukturerade delar till parent
    onChange(place, addressParts);
  };

  // Om token fortfarande laddas, visa laddningsindikator
  if (isTokenLoading) {
    return (
      <div className="relative">
        <Input 
          value="Laddar adresssökning..." 
          disabled 
          className={className}
        />
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {/* Removed FormControl wrapper here */}
        <Input
          id={id}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          required={required}
          className={`pl-9 pr-9 ${className} ${error ? 'border-destructive' : ''}`}
        />
        
        {/* Validitetsindikator */}
        {inputValue && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isSearching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {!isSearching && selectedAddress && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            {!isSearching && !selectedAddress && inputValue.length > 2 && (
              <XCircle className="h-4 w-4 text-amber-500" />
            )}
          </div>
        )}
      </div>
      
      {/* Sökförslag */}
      {suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full rounded-md border border-border bg-background shadow-lg"
        >
          <ul className="py-1 max-h-60 overflow-auto">
            {suggestions.map((feature) => (
              <li 
                key={feature.id}
                className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                onClick={() => handleSelectSuggestion(feature)}
              >
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-primary" />
                  <span>{feature.place_name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
