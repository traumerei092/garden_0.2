'use client'

import React, { Suspense, useEffect, useState } from 'react';
import DividerLine from "@/components/DividerLine";
import SearchConditions from "@/components/SearchConditions";
import CreateShop from "@/components/CreateShop";
import { Shop } from "@/types/shop";
import { getShops } from "@/actions/shops";
import ShopList from "@/components/ShopList";
import { useSession } from 'next-auth/react';
import ShopNav from "@/components/ShopNav";
import { calculateDistance, getUserLocation } from "@/actions/distance";
import { getCoordinatesFromAddress } from "@/actions/geocoding";
import { useSearchParams } from "next/navigation";

interface ShopWithDistance extends Shop {
    distance?: number;
}

function ShopsContent() {
    const [shops, setShops] = useState<ShopWithDistance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session, status } = useSession();
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const searchParams = useSearchParams();
    const [showCreateShop, setShowCreateShop] = useState(true);

    useEffect(() => {
        const controlCreateShop = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY === 0) { // 画面の一番上
                    setShowCreateShop(false);
                } else { // それ以外の位置
                    setShowCreateShop(true);
                }
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlCreateShop);

            // 初期状態を設定
            controlCreateShop();

            // クリーンアップ関数
            return () => {
                window.removeEventListener('scroll', controlCreateShop);
            };
        }
    }, []);

    useEffect(() => {
        const fetchShopsAndLocation = async () => {
            try {
                if (searchParams) {
                    const keyword = searchParams.get('keyword') ?? '';
                    const types = searchParams.get('types')?.split(',') || [];
                    const concepts = searchParams.get('concepts')?.split(',') || [];
                    const layouts = searchParams.get('layouts')?.split(',') || [];
                    const region = searchParams.get('region') ?? '';
                    const prefecture = searchParams.get('prefecture') ?? '';
                    const city = searchParams.get('city') ?? '';

                    const [fetchedShops, location] = await Promise.all([
                        getShops(keyword, types, concepts, layouts, region, prefecture, city),
                        getUserLocation().catch(error => {
                            console.error("Error getting user location:", error);
                            return null;
                        })
                    ]);

                    setUserLocation(location);

                    const shopsWithCoordinates = await Promise.all(fetchedShops.map(async (shop) => {
                        if (!shop.latitude || !shop.longitude) {
                            const fullAddress = `${shop.address.prefecture}${shop.address.city}${shop.address.town}${shop.address.street_address}`;
                            const coordinates = await getCoordinatesFromAddress(fullAddress);
                            if (coordinates) {
                                return { ...shop, latitude: coordinates.lat, longitude: coordinates.lng };
                            }
                        }
                        return shop;
                    }));

                    if (location) {
                        const shopsWithDistance = shopsWithCoordinates.map(shop => ({
                            ...shop,
                            distance: shop.latitude && shop.longitude
                                ? calculateDistance(
                                    location.latitude,
                                    location.longitude,
                                    shop.latitude,
                                    shop.longitude
                                )
                                : undefined
                        }));
                        shopsWithDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
                        setShops(shopsWithDistance);
                    } else {
                        setShops(fetchedShops);
                    }

                    setLoading(false);
                }
            } catch (err) {
                setError('Failed to fetch shops');
                setLoading(false);
            }
        };

        fetchShopsAndLocation();
    }, [searchParams]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchConditions />
            <DividerLine />
            <ShopNav shopCount={shops.length} />
            {loading && <div>Loading shops...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && !error && <ShopList shops={shops} userLocation={userLocation} />}
            <CreateShop  show={showCreateShop} />
            <svg width="0" height="0">
                <defs>
                    <linearGradient id="gradientColors" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00c6ff" />
                        <stop offset="100%" stopColor="#eb0ef2" />
                    </linearGradient>
                </defs>
            </svg>
        </Suspense>
    )
}

export default function Shops() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ShopsContent />
        </Suspense>
    )
}
