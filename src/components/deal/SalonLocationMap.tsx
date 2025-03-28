
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";

interface SalonLocationMapProps {
  address: string;
  salonName: string;
}

export const SalonLocationMap = ({ address, salonName }: SalonLocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapboxTokenVisible, setIsMapboxTokenVisible] = useState(false);

  // Funktion för att konvertera adress till koordinater
  const getCoordinates = async (address: string) => {
    try {
      if (!mapboxToken) return;
      
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${mapboxToken}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Kunde inte hitta koordinater för den angivna adressen');
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return [lng, lat] as [number, number];
      } else {
        throw new Error('Inga resultat hittades för adressen');
      }
    } catch (error) {
      console.error('Fel vid geokodning:', error);
      setMapError('Kunde inte ladda kartan för denna adress');
      return null;
    }
  };

  // Initialisera kartan när komponenten laddas
  useEffect(() => {
    if (!address || !mapboxToken || !mapContainer.current || map.current) return;
    
    const initializeMap = async () => {
      try {
        const coords = await getCoordinates(address);
        if (!coords) return;
        
        setCoordinates(coords);
        
        mapboxgl.accessToken = mapboxToken;
        
        const newMap = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: coords,
          zoom: 15,
          attributionControl: false
        });
        
        map.current = newMap;
        
        // Lägg till navigeringskontroller
        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Lägg till markör
        new mapboxgl.Marker({
          color: "#520053"
        })
          .setLngLat(coords)
          .addTo(newMap);
      } catch (error) {
        console.error('Fel vid initialisering av karta:', error);
        setMapError('Kunde inte ladda kartan');
      }
    };
    
    initializeMap();
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [address, mapboxToken]);

  // Hantera vägbeskrivning
  const handleGetDirections = () => {
    if (!coordinates) return;
    
    const [lng, lat] = coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(salonName + ' ' + address)}`;
    window.open(url, '_blank');
  };

  // Om vi inte har en Mapbox-token, visa inmatningsfält
  if (!mapboxToken) {
    return (
      <div className="space-y-4 p-4 border border-border rounded-md bg-background">
        {isMapboxTokenVisible ? (
          <>
            <div className="text-center text-sm text-muted-foreground mb-2">
              Ange en Mapbox token för att visa kartan. Denna används bara temporärt i denna session.
            </div>
            <input 
              type="text" 
              className="w-full p-2 border border-input rounded-md"
              placeholder="Ange din Mapbox token"
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <div className="text-xs text-muted-foreground">
              Gå till <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Mapbox.com</a> för att skapa ett konto och få din publika token.
            </div>
          </>
        ) : (
          <Button 
            onClick={() => setIsMapboxTokenVisible(true)}
            variant="outline" 
            className="w-full"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Visa karta för denna adress
          </Button>
        )}
      </div>
    );
  }

  // Om det uppstod ett fel
  if (mapError) {
    return (
      <div className="p-4 border border-border rounded-md bg-background">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{address}</span>
        </div>
        <div className="mt-2 text-sm text-destructive">{mapError}</div>
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={handleGetDirections}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Få vägbeskrivning
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground pl-2">
        <MapPin className="h-4 w-4" />
        <span>{address}</span>
      </div>
      
      <div 
        ref={mapContainer} 
        className="h-48 w-full rounded-md overflow-hidden border border-border"
        style={{ backgroundColor: '#eee' }}
      />
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleGetDirections}
      >
        <Navigation className="h-4 w-4 mr-2" />
        Få vägbeskrivning
      </Button>
    </div>
  );
};
