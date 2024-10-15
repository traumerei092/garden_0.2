// components/Map.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Input, Button } from '@nextui-org/react';
import ShopCard from '@/components/ShopCard';
import { Shop } from '@/types/shop';
import { getShops } from '@/actions/shops';
import Slider from 'react-slick';
import {ListIcon, Search, Filter, User, SlidersHorizontalIcon, Navigation} from 'lucide-react';
import styles from './style.module.scss';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useRouter} from "next/navigation";

// LatLngLiteral の型定義
type LatLngLiteral = google.maps.LatLngLiteral;

const Map: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
  };

  useEffect(() => {
    const fetchShops = async () => {
      const fetchedShops = await getShops(keyword, null, selectedConcept ? [selectedConcept] : null, null);
      setShops(fetchedShops);
    };
    fetchShops();
  }, [keyword, selectedConcept]);

  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };

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

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map?.panTo({ lat: latitude, lng: longitude });
        },
        () => {
          alert('現在地を取得できませんでした。');
        }
      );
    } else {
      alert('お使いのブラウザはGeolocationをサポートしていません。');
    }
  };

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
                  if (typeof shop.latitude === 'number' && typeof shop.longitude === 'number') {
                      const position: LatLngLiteral = {
                          lat: shop.latitude,
                          lng: shop.longitude
                      };
                      return (
                          <Marker
                              key={shop.id}
                              position={position}
                              icon={{
                                  url: '/custom-marker.png',
                                  scaledSize: new window.google.maps.Size(30, 30),
                              }}
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
                  <Slider {...sliderSettings}>
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