'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader } from "@googlemaps/js-api-loader"

const MapPage: React.FC = () => {
    const searchParams = useSearchParams();
    const [map, setMap] = useState<google.maps.Map | null>(null);

    useEffect(() => {
        if (searchParams) {
            const lat = parseFloat(searchParams.get('lat') || '33.5902');
            const lng = parseFloat(searchParams.get('lng') || '130.4017');

            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
                version: "weekly",
            });

            loader.load().then(() => {
                const mapElement = document.getElementById("map") as HTMLElement;
                const newMap = new google.maps.Map(mapElement, {
                    center: {lat, lng},
                    zoom: 14,
                });

                setMap(newMap);

                // ユーザーの位置にマーカーを追加
                new google.maps.Marker({
                    position: {lat, lng},
                    map: newMap,
                    title: "Your Location"
                });

                // ここで周辺のショップを取得し、マーカーを追加するロジックを実装できます
            });
        } else {
            // searchParams が null の場合、デフォルト値を使用
            const lat = 33.5902;
            const lng = 130.4017;

            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
                version: 'weekly',
            });
        }
    }, [searchParams]);

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <div id="map" style={{ height: "100%", width: "100%" }}></div>
        </div>
    );
};

export default MapPage;