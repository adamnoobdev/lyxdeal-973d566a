
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SalonLocationMapProps {
  address: string;
  salonName: string;
}

export const SalonLocationMap = ({ address, salonName }: SalonLocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    // Try to get the token from localStorage if it exists
    return localStorage.getItem('mapbox_token') || "";
  });
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapboxTokenVisible, setIsMapboxTokenVisible] = useState(false);
  const [isTokenSaved, setIsTokenSaved] = useState(!!mapboxToken);

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

  const saveMapboxToken = () => {
    if (mapboxToken) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setIsTokenSaved(true);
      setIsMapboxTokenVisible(false);
    }
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapboxToken(e.target.value);
    setIsTokenSaved(false);
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
  if (!isTokenSaved) {
    return (
      <div className="space-y-4 p-4 border border-border rounded-md bg-background">
        {isMapboxTokenVisible ? (
          <>
            <Alert className="mb-4">
              <AlertDescription>
                För att visa kartan behöver du ange din Mapbox API-nyckel. 
                Denna lagras endast i din webbläsare och används bara för att visa kartor.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Input 
                type="text" 
                value={mapboxToken}
                className="w-full"
                placeholder="Ange din Mapbox token"
                onChange={handleTokenChange}
              />
              
              <Button 
                onClick={saveMapboxToken} 
                className="w-full"
                disabled={!mapboxToken}
              >
                <Key className="h-4 w-4 mr-2" />
                Spara nyckel och visa karta
              </Button>
              
              <div className="text-xs text-muted-foreground">
                Gå till <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Mapbox.com</a> för att skapa ett konto och få din publika token.
              </div>
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
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleGetDirections}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Få vägbeskrivning
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex-none"
            onClick={() => {
              localStorage.removeItem('mapbox_token');
              setIsTokenSaved(false);
              setMapboxToken("");
            }}
          >
            <Key className="h-4 w-4" />
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
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleGetDirections}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Få vägbeskrivning
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex-none"
          onClick={() => {
            localStorage.removeItem('mapbox_token');
            setIsTokenSaved(false);
            setMapboxToken("");
          }}
          title="Ändra Mapbox API-nyckel"
        >
          <Key className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
