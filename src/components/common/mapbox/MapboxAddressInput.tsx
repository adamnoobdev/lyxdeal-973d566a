
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { AddressSuggestions } from './AddressSuggestions';
import { useAddressSearch } from './useAddressSearch';
import { MapboxAddressInputProps } from './types';

export const MapboxAddressInput = ({
  defaultValue = '',
  onChange,
  id,
  placeholder = 'Sök adress...',
  required,
  className,
  error
}: MapboxAddressInputProps) => {
  const { 
    inputValue, 
    setInputValue,
    suggestions, 
    isSearching, 
    selectedAddress, 
    isValid,
    isTokenLoading,
    handleInputChange,
    handleSelectSuggestion
  } = useAddressSearch(defaultValue, onChange);

  useEffect(() => {
    // When component first renders, set initial value
    if (defaultValue) {
      setInputValue(defaultValue);
    }
  }, [defaultValue, setInputValue]);

  // If token is still loading, show loading indicator
  if (isTokenLoading) {
    return (
      <div className="relative w-full">
        <Input 
          value="Laddar adresssökning..." 
          disabled 
          className={`w-full ${className}`}
        />
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative w-full">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          required={required}
          className={`pl-9 pr-9 w-full ${className} ${error ? 'border-destructive' : ''}`}
        />
        
        {/* Validity indicator */}
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
      
      {/* Search suggestions */}
      <AddressSuggestions 
        suggestions={suggestions}
        onSelectSuggestion={handleSelectSuggestion}
        isVisible={suggestions.length > 0}
      />
    </div>
  );
};
