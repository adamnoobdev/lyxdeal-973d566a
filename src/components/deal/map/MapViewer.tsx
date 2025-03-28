
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewerProps {
  mapboxToken: string;
  coordinates: [number, number];
  className?: string;
}

export const MapViewer = ({ mapboxToken, coordinates, className }: MapViewerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates,
      zoom: 15,
      attributionControl: false,
      logoPosition: 'bottom-left'
    });
    
    map.current = newMap;
    
    // Lägg till navigeringskontroller
    newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Lägg till markör
    new mapboxgl.Marker({
      color: "#520053"
    })
      .setLngLat(coordinates)
      .addTo(newMap);
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates, mapboxToken]);

  return (
    <div 
      ref={mapContainer} 
      className={`${className || "h-48 w-full rounded-md overflow-hidden border border-border"} mapboxgl-map-container`}
      style={{ backgroundColor: '#eee' }}
    />
  );
};
