import React from 'react';
import { Shop } from '../../types/shop';
import styles from './style.module.scss';
import ShopCard from "@/components/ShopCard";

interface ShopListProps {
  shops: (Shop & { distance?: number })[];
}

const ShopList: React.FC<ShopListProps> = ({ shops }) => {
    return (
        <div className={styles.shopList}>
            {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
            ))}
        </div>
    );
};

export default ShopList;