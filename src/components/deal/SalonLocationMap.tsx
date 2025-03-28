
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface SalonLocationMapProps {
  address: string;
  salonName: string;
}

export const SalonLocationMap = ({ address, salonName }: SalonLocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hämta Mapbox-token från Supabase
  useEffect(() => {
    const getMapboxToken = async () => {
      try {
        setIsLoading(true);
        
        // Anropa en edge-funktion som returnerar Mapbox-token
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Fel vid hämtning av Mapbox-token:', error);
          setMapError('Kunde inte ladda karttjänsten');
          setIsLoading(false);
          return;
        }
        
        // Sätt token om den returnerades
        if (data && data.token) {
          setMapboxToken(data.token);
        } else {
          setMapError('Mapbox API-nyckel saknas');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Fel vid hämtning av Mapbox-token:', error);
        setMapError('Kunde inte ladda karttjänsten');
        setIsLoading(false);
      }
    };

    getMapboxToken();
  }, []);

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

  // Initialisera kartan när komponenten laddas och mapboxToken är tillgängligt
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

  // Visa laddningsindikator
  if (isLoading) {
    return (
      <div className="p-4 border border-border rounded-md bg-background">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{address}</span>
        </div>
        <div className="h-48 w-full rounded-md overflow-hidden border border-border mt-4 flex items-center justify-center bg-accent/5">
          <div className="animate-pulse">Laddar karta...</div>
        </div>
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
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleGetDirections}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Få vägbeskrivning
          </Button>
        </div>
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
      
      <div>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleGetDirections}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Få vägbeskrivning
        </Button>
      </div>
    </div>
  );
};
