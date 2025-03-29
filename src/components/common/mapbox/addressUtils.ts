
import { AddressParts } from './types';

// Parse address parts from Mapbox feature
export const parseAddressParts = (feature: any): AddressParts => {
  const coordinates = feature.center as [number, number];
  const context = feature.context || [];
  
  // Extract parts of the address
  let street = feature.text || '';
  let postalCode = '';
  let city = '';
  
  if (feature.address) {
    street = `${feature.address} ${street}`;
  }
  
  // Find postal code and city from context
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
