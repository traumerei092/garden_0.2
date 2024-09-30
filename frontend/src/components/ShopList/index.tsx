import React from 'react';
import { Shop } from '../../types/shop';
import styles from './style.module.scss';
import ShopCard from "@/components/ShopCard";

interface ShopListProps {
  shops: (Shop & { distance?: number })[];
  userLocation?: { latitude: number; longitude: number } | null; // ユーザーの位置情報
}

const ShopList: React.FC<ShopListProps> = ({ shops, userLocation }) => {
    return (
        <div className={styles.shopList}>
            {shops.map((shop) => (
                // ShopCardコンポーネント内で距離も表示する
                <ShopCard key={shop.id} shop={shop} userLocation={userLocation} />
            ))}
        </div>
    );
};

export default ShopList;