import React from 'react';
import styles from './style.module.scss';
import {Button, Navbar, NavbarContent} from "@nextui-org/react";
import {ListFilter, MapPinnedIcon} from "lucide-react";
import {useRouter} from "next/navigation";

interface ShopNavProps {
  shopCount: number;  // 追加: ショップの数を受け取るプロップ
}

const ShopNav: React.FC<ShopNavProps> = ({ shopCount }) => {
    const router = useRouter();

    const handleMapSearch = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    router.push(`/map?lat=${latitude}&lng=${longitude}`);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("位置情報の取得に失敗しました。デフォルトの位置を使用します。");
                    // デフォルトの位置（例：福岡市の中心）を使用
                    router.push(`/map?lat=33.5902&lng=130.4017`);
                }
            );
        } else {
            alert("お使いのブラウザは位置情報をサポートしていません。デフォルトの位置を使用します。");
            router.push(`/map?lat=33.5902&lng=130.4017`);
        }
    };

    return (
        <div className={styles.navBar}>
            <div className={styles.start}>
                <p>{shopCount.toLocaleString()}件</p>
            </div>
            <div className={styles.center}>
                <div className={styles.outerButton}>
                    <Button className={styles.innerButton} onClick={handleMapSearch}>
                        <MapPinnedIcon className={styles.mapPinnedIcon} strokeWidth={1}/>
                        <p>地図で探す</p>
                    </Button>
                </div>
            </div>
            <div className={styles.end}>
                <Button className={styles.filterWrapper}>
                    <ListFilter className={styles.listFilter} />
                </Button>
            </div>
        </div>
    );
};

export default ShopNav;