
import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !coordinates) {
      console.log("Missing requirements for map:", { 
        hasContainer: !!mapContainer.current, 
        hasToken: !!mapboxToken, 
        hasCoords: !!coordinates 
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
    } catch (error) {
      console.error('Error initializing map:', error);
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

  return (
    <div className="h-48 w-full rounded-md overflow-hidden border border-border">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};
