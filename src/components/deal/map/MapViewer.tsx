
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AlertTriangle } from 'lucide-react';

export interface MapViewerProps {
  mapboxToken: string;
  coordinates: [number, number];
}

export const MapViewer = ({ mapboxToken, coordinates }: MapViewerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Validate input
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
      
      // Clear any previous map
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      
      // Initialize Mapbox
      mapboxgl.accessToken = mapboxToken;
      
      const [lng, lat] = coordinates;
      
      // Create new map
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: 14,
        attributionControl: false,
        refreshExpiredTiles: false, // Prevent reloading expired tiles
      });
      
      map.current = newMap;
      
      // Add marker with custom color
      new mapboxgl.Marker({ 
        color: '#9b87f5', // Lyxdeal primary color
        scale: 1.1
      })
        .setLngLat([lng, lat])
        .addTo(newMap);
      
      // Add navigation controls
      newMap.addControl(new mapboxgl.NavigationControl({
        showCompass: true,
        visualizePitch: false,
      }), 'top-right');
      
      // Handle errors
      newMap.on('error', (e) => {
        console.error('Mapbox map error:', e);
        setErrorMessage('Ett fel uppstod med kartan');
      });

      // Hide Mapbox logo and attribution
      newMap.on('load', () => {
        // Hide Mapbox branding
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
    
    // Clean up when component unmounts
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
