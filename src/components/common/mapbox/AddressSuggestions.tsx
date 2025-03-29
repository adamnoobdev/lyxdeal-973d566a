
import { useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { SuggestionItemProps } from './types';

const SuggestionItem = ({ feature, onSelect }: SuggestionItemProps) => {
  return (
    <li 
      key={feature.id}
      className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
      onClick={() => onSelect(feature)}
    >
      <div className="flex items-start">
        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-primary" />
        <span>{feature.place_name}</span>
      </div>
    </li>
  );
};

interface AddressSuggestionsProps {
  suggestions: any[];
  onSelectSuggestion: (feature: any) => void;
  isVisible: boolean;
}

export const AddressSuggestions = ({ 
  suggestions, 
  onSelectSuggestion, 
  isVisible 
}: AddressSuggestionsProps) => {
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add listener to close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        // We're not directly setting state here to avoid circular dependencies
        // Instead, we'll let the parent component handle this
        if (suggestions.length > 0) {
          onSelectSuggestion(null); // Pass null to indicate closing without selection
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [suggestions, onSelectSuggestion]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div 
      ref={suggestionsRef}
      className="absolute z-10 mt-1 w-full rounded-md border border-border bg-background shadow-lg"
    >
      <ul className="py-1 max-h-60 overflow-auto">
        {suggestions.map((feature) => (
          <SuggestionItem 
            key={feature.id}
            feature={feature} 
            onSelect={onSelectSuggestion} 
          />
        ))}
      </ul>
    </div>
  );
};
