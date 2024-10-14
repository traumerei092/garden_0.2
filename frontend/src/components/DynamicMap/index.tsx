import React, { useEffect, useRef, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader"

interface DynamicMapProps {
  lat: number;
  lng: number;
}

const DynamicMap: React.FC<DynamicMapProps> = ({ lat, lng }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: "weekly",
        });

        await loader.load();

        if (!mapRef.current) {
          console.error("Map container not found");
          return;
        }

        const map = new google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 14,
        });

        setMapInstance(map);

        new google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: "Your Location"
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();
  }, [lat, lng]);

  return <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
};

export default DynamicMap;