
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AlertTriangle } from 'lucide-react';

interface MapViewerProps {
  mapboxToken: string;
  coordinates: [number, number];
}

export const MapViewer = ({ mapboxToken, coordinates }: MapViewerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Validera indata
    if (!mapContainer.current) {
      console.log("Missing map container");
      return;
    }
    
    if (!mapboxToken) {
      console.log("Missing Mapbox token");
      setErrorMessage('Mapbox-token saknas');
      return;
    }
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      console.log("Invalid coordinates:", coordinates);
      setErrorMessage('Ogiltiga koordinater');
      return;
    }

    try {
      console.log("Initializing map with coordinates:", coordinates);
      
      // Rensa eventuell tidigare karta
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      
      // Initiera Mapbox
      mapboxgl.accessToken = mapboxToken;
      
      const [lng, lat] = coordinates;
      
      // Skapa ny karta
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: 14,
        attributionControl: false,
        refreshExpiredTiles: false, // Förhindra omladdning av förfallna rutor
      });
      
      map.current = newMap;
      
      // Lägg till markör med anpassad färg
      new mapboxgl.Marker({ 
        color: '#9b87f5', // Lyxdeal primary color
        scale: 1.1
      })
        .setLngLat([lng, lat])
        .addTo(newMap);
      
      // Lägg till navigationskontroller
      newMap.addControl(new mapboxgl.NavigationControl({
        showCompass: true,
        visualizePitch: false,
      }), 'top-right');
      
      // Hantera fel
      newMap.on('error', (e) => {
        console.error('Mapbox map error:', e);
        setErrorMessage('Ett fel uppstod med kartan');
      });

      // Dölj Mapbox-logotypen och attributionen
      newMap.on('load', () => {
        // Dölj Mapbox branding
        const style = document.createElement('style');
        style.textContent = `
          .mapboxgl-ctrl-logo { display: none !important; }
          .mapboxgl-ctrl-attrib { display: none !important; }
        `;
        document.head.appendChild(style);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setErrorMessage('Kunde inte visa kartan');
    }
    
    // Städa upp när komponenten avmonteras
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, coordinates]);

  if (errorMessage) {
    return (
      <div className="h-48 w-full rounded-md overflow-hidden border border-border bg-accent/5 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4" />
          <span>{errorMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-48 w-full rounded-md overflow-hidden border border-primary/20 relative shadow-sm">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};
