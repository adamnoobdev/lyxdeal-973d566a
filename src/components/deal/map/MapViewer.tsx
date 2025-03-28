
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

interface MapViewerProps {
  mapboxToken: string;
  coordinates: [number, number];
}

export const MapViewer = ({ mapboxToken, coordinates }: MapViewerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      console.log("Missing requirements for map:", { 
        hasContainer: !!mapContainer.current, 
        hasToken: !!mapboxToken, 
        hasCoords: !!coordinates,
        validCoords: coordinates && Array.isArray(coordinates) && coordinates.length === 2
      });
      return;
    }

    try {
      console.log("Initializing map with token and coordinates:", coordinates);
      
      // Initialize map
      mapboxgl.accessToken = mapboxToken;
      
      const [lng, lat] = coordinates;
      
      if (map.current) {
        map.current.remove();
      }
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: 14,
        attributionControl: false,
      });
      
      map.current = newMap;
      
      // Add marker
      new mapboxgl.Marker({ color: '#2563EB' })
        .setLngLat([lng, lat])
        .addTo(newMap);
      
      // Add navigation controls
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      console.log("Map initialized successfully");

      // Add error handling
      newMap.on('error', (e) => {
        console.error('Mapbox map error:', e);
        setErrorMessage('Ett fel uppstod med kartan');
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setErrorMessage('Kunde inte visa kartan');
    }
    
    // Cleanup
    return () => {
      if (map.current) {
        console.log("Cleaning up map instance");
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, coordinates]);

  if (errorMessage) {
    return (
      <div className="h-48 w-full rounded-md overflow-hidden border border-border bg-accent/5 flex items-center justify-center">
        <div className="text-sm text-muted-foreground">{errorMessage}</div>
      </div>
    );
  }

  return (
    <div className="h-48 w-full rounded-md overflow-hidden border border-border relative">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};
