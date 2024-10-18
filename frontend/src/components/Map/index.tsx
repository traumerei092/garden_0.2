// components/Map.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Input, Button } from '@nextui-org/react';
import ShopCard from '@/components/ShopCard';
import { Shop } from '@/types/shop';
import { getCoordinatesFromAddress, GeocodingResult } from '@/actions/geocoding';
import { getShops } from '@/actions/shops';
import Slider from 'react-slick';
import {ListIcon, Search, Filter, User, SlidersHorizontalIcon, Navigation} from 'lucide-react';
import styles from './style.module.scss';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useRouter} from "next/navigation";
import CustomMarker from "@/components/CustomMarker/index";

// LatLngLiteral の型定義
type LatLngLiteral = google.maps.LatLngLiteral;

interface ShopWithCoordinates extends Shop {
  coordinates?: GeocodingResult;
}

const Map: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const router = useRouter();
  const sliderRef = useRef<Slider>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '20px',
    arrows: false,
    afterChange: (current: number) => {
      if (shops[current]) {
        setSelectedShopId(shops[current].id);
      }
    },
  };

  useEffect(() => {
    const fetchShopsAndCoordinates = async () => {
      const fetchedShops = await getShops(keyword, null, selectedConcept ? [selectedConcept] : null, null);
      const shopsWithCoordinates = await Promise.all(fetchedShops.map(async (shop) => {
        const fullAddress = `${shop.address.prefecture}${shop.address.city}${shop.address.town}${shop.address.street_address}`;
        const coordinates = await getCoordinatesFromAddress(fullAddress);
        return { ...shop, coordinates };
      }));
      setShops(shopsWithCoordinates);
    };
    fetchShopsAndCoordinates();
  }, [keyword, selectedConcept]);

  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({lat: 33.5902, lng: 130.4017});
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerClick = useCallback((shopId: string) => {
    const index = shops.findIndex(shop => shop.id === shopId);
    if (index !== -1 && sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
    setSelectedShopId(shopId);

    // マーカーをクリックしたときにマップの中心を移動
    const shop = shops[index];
    if (shop.coordinates && mapRef.current) {
      mapRef.current.panTo(shop.coordinates);
    }
  }, [shops]);

  const handleSlideChange = useCallback((current: number) => {
    if (shops[current]) {
      setSelectedShopId(shops[current].id);

      if (shops[current].coordinates && mapRef.current) {
        mapRef.current.panTo(shops[current].coordinates);
      }
    }
  }, [shops]);

  const handleSearch = () => {
    // Implement keyword search logic here
  };

  const handleConceptFilter = (concept: string) => {
    setSelectedConcept(concept);
  };

  const handleBackToList = () => {
    // Implement back to list logic here
      router.push('/shops'); // '/shops'ページに遷移
  };

  const handleCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current) {
            mapRef.current.panTo({ lat: latitude, lng: longitude });
          }
        },
        () => {
          alert('現在地を取得できませんでした。');
        }
      );
    } else {
      alert('お使いのブラウザはGeolocationをサポートしていません。');
    }
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
      <div className={styles.mapContainer}>
          <div className={styles.topButtons}>
              <Button
                  className={styles.topButton}
                  onClick={handleBackToList}
              >
                  <ListIcon size={20}/>
              </Button>
              <div className={styles.searchContainer}>
                  <Input
                      classNames={{
                          base: styles.searchInputBase,
                          mainWrapper: styles.searchInputMainWrapper,
                          input: styles.searchInputInner,
                          inputWrapper: styles.searchInputWrapper
                      }}
                      placeholder="キーワード検索"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      startContent={<Search size={20}/>}
                  />
              </div>
              <Button
                  className={styles.topButton}
                  onClick={() => {
                  }}
              >
                  <SlidersHorizontalIcon size={20}/>
              </Button>
          </div>
          <Button
              className={styles.conceptButton}
              onClick={() => handleConceptFilter('一人で飲める')}
              startContent={<User size={20}/>}
          >
              一人で飲める
          </Button>
          <GoogleMap
              mapContainerStyle={{height: '100%', width: '100%'}}
              center={{lat: 33.5902, lng: 130.4017}}
              zoom={14}
              onLoad={onMapLoad}
              options={{
                  disableDefaultUI: true,
              }}
          >
              {shops.map((shop) => {
                if (shop.coordinates && typeof shop.coordinates.lat === 'number' && typeof shop.coordinates.lng === 'number') {
                    return (
                      <CustomMarker
                        key={shop.id}
                        shop={shop}
                        position={{ lat: shop.coordinates.lat, lng: shop.coordinates.lng }}
                        isSelected={shop.id === selectedShopId}
                        onClick={() => handleMarkerClick(shop.id)}
                      />
                    );
                  }
                  return null; // latitude または longitude が number でない場合はマーカーを表示しない
              })}
          </GoogleMap>
          <div className={styles.bottomContainer}>
              <Button
                  className={styles.currentLocationButton}
                  onClick={handleCurrentLocation}
              >
                  <Navigation size={20}/>
                  現在地に戻る
              </Button>

              <div className={`${styles.shopCardContainer} ${styles.slickSlideWrapper}`}>
                  <Slider {...sliderSettings} ref={sliderRef} afterChange={handleSlideChange}>
                      {shops.map((shop) => (
                          <div key={shop.id}>
                              <ShopCard shop={shop}/>
                          </div>
                      ))}
                  </Slider>
              </div>
          </div>
      </div>
  );
};

export default Map;