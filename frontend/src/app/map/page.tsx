'use client'

import React, {Suspense, useEffect, useState} from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader } from "@googlemaps/js-api-loader"

const MapPage: React.FC = () => {
    const searchParams = useSearchParams();
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [isParamsReady, setIsParamsReady] = useState(false);  // 新しくフラグを追加

    useEffect(() => {
        if (searchParams) {
            const lat = parseFloat(searchParams.get('lat') ?? '33.5902');
            const lng = parseFloat(searchParams.get('lng') ?? '130.4017');

            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
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

                setIsParamsReady(true);  // 準備完了のフラグを設定
            });
        }
    }, [searchParams]);

    if (!isParamsReady) {
        return <div>Loading...</div>;  // デフォルトのローディング表示
    }


    return (
        <div style={{height: "100vh", width: "100%"}}>
            <div id="map" style={{height: "100%", width: "100%"}}></div>
        </div>
    );
};

export default MapPage;