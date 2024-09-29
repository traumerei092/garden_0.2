import React, {useEffect, useState} from 'react';
import {Card, CardBody, CardFooter, Image, Chip, Breadcrumbs, BreadcrumbItem, Button} from "@nextui-org/react";
import {Shop, ShopConcept, ShopLayout, ShopType} from '../../types/shop';
import styles from './style.module.scss';
import {CardHeader} from "@nextui-org/card";
import {formatDistance} from "@/actions/distance";
import {useRouter} from "next/navigation";
import {getShopConcepts, getShopLayouts, getShopTypes} from "@/actions/shops";

interface ShopCardProps {
    shop: Shop & { distance?: number };
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
    const router = useRouter();
    const distanceText = shop.distance !== undefined ? formatDistance(shop.distance) : '距離不明';
    const [types, setTypes] = useState<ShopType[]>([]);
    const [concepts, setConcepts] = useState<ShopConcept[]>([]);
    const [layouts, setLayouts] = useState<ShopLayout[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [fetchedTypes, fetchedConcepts, fetchedLayouts] = await Promise.all([
                getShopTypes(),
                getShopConcepts(),
                getShopLayouts()
            ]);
            setTypes(fetchedTypes);
            setConcepts(fetchedConcepts);
            setLayouts(fetchedLayouts);
        };
        fetchData();
    }, []);

    const getTypeName = (id: number) => types.find(t => t.id === id)?.name || 'Unknown Type';
    const getConceptName = (id: number) => concepts.find(c => c.id === id)?.name || 'Unknown Concept';
    const getLayoutName = (id: number) => layouts.find(l => l.id === id)?.name || 'Unknown Layout';

    const handleShopClick = () => {
        router.push(`/shops/${shop.id}`);  // ショップの詳細ページへのパスを適切に設定してください
    };

    // ランダムに1つの要素を選択する関数
    const getRandomElement = <T extends number>(array: T[]): T | undefined => {
        return array && array.length > 0 ? array[Math.floor(Math.random() * array.length)] : undefined;
    };

    const randomConceptId = getRandomElement(shop.concepts);
    const randomLayoutId = getRandomElement(shop.layouts);

    return (
        <Button
            className={styles.shopButton}
            onClick={handleShopClick}
        >
            <Card className={styles.shopCard}>
                <CardHeader className={styles.cardHeader}>
                    <h1>{shop.name}</h1>
                </CardHeader>
                <CardBody className={styles.cardBody}>
                    <Image
                        removeWrapper
                        src={shop.icon_image || '/default-shop-icon.png'}
                        alt={shop.name}
                        className={styles.shopImage}
                    />
                    <div className={styles.imageOverlay}></div>
                    <div className={styles.overlay}></div>
                </CardBody>
                <CardFooter className={styles.cardFooter}>
                    <div className={styles.distance}>
                        <p>現在地から{distanceText}</p>
                        <Breadcrumbs size="sm" className={styles.addressBreadcrumbs} color={"warning"}>
                            <BreadcrumbItem>{shop.address?.prefecture || '県名不明'}</BreadcrumbItem>
                            <BreadcrumbItem>{shop.address?.city || '市名不明'}</BreadcrumbItem>
                            <BreadcrumbItem>{shop.address?.town || '町名不明'}</BreadcrumbItem>
                        </Breadcrumbs>
                    </div>
                    <div className={styles.attribute}>
                        {shop.types && shop.types.map((typeId) => (
                            <Chip key={typeId} className={styles.typeChip}>
                                {getTypeName(typeId)}
                            </Chip>
                        ))}

                    </div>
                    <div className={styles.concept}>
                        {randomConceptId && (
                            <Chip className={styles.conceptChip}>
                                {getConceptName(randomConceptId)}
                            </Chip>
                        )}
                        {randomLayoutId && (
                            <Chip className={styles.layoutChip}>
                                {getLayoutName(randomLayoutId)}
                            </Chip>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </Button>
    );
};

export default ShopCard;