
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
        attributionControl: false, // Disable default attribution control
      });
      
      map.current = newMap;
      
      // Add marker with custom color matching Lyxdeal primary color
      new mapboxgl.Marker({ 
        color: '#9b87f5', // Primary purple Lyxdeal color
        scale: 1.1 // Slightly larger marker
      })
        .setLngLat([lng, lat])
        .addTo(newMap);
      
      // Add navigation controls with custom positioning
      newMap.addControl(new mapboxgl.NavigationControl({
        showCompass: true,
        visualizePitch: false,
      }), 'top-right');
      
      console.log("Map initialized successfully");

      // Add error handling
      newMap.on('error', (e) => {
        console.error('Mapbox map error:', e);
        setErrorMessage('Ett fel uppstod med kartan');
      });

      // Apply custom map style to match Lyxdeal theme
      newMap.on('load', () => {
        if (!map.current) return;

        // Create a simple style change that won't cause rendering issues
        try {
          // Use simpler, more reliable style changes
          map.current.setPaintProperty('water', 'fill-color', '#f9eeff');
          map.current.setPaintProperty('building', 'fill-color', '#f3e8ff');
          
          // Remove Mapbox logo and attribution
          const mapCanvas = map.current.getCanvas();
          const mapContainer = mapCanvas.parentElement;
          
          if (mapContainer) {
            // Add style to hide Mapbox branding
            const style = document.createElement('style');
            style.textContent = `
              .mapboxgl-ctrl-logo { display: none !important; }
              .mapboxgl-ctrl-attrib { display: none !important; }
            `;
            document.head.appendChild(style);
          }
        } catch (styleError) {
          console.warn('Non-critical style application error:', styleError);
          // Continue with basic map if styling fails
        }
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
