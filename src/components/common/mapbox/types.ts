
import { ReactNode } from 'react';

export interface AddressParts {
  street?: string;
  postalCode?: string;
  city?: string;
  coordinates?: [number, number];
}

export interface MapboxAddressInputProps {
  defaultValue?: string;
  onChange: (value: string, parts?: AddressParts) => void;
  id?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: boolean;
}

export interface SuggestionItemProps {
  feature: any;
  onSelect: (feature: any) => void;
  children?: ReactNode;
}
