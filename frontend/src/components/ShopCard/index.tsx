import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, Image, Chip, Breadcrumbs, BreadcrumbItem, Button } from "@nextui-org/react";
import { Shop, ShopConcept, ShopLayout, ShopType } from '@/types/shop';
import styles from './style.module.scss';
import { CardHeader } from "@nextui-org/card";
import { formatDistance } from "@/actions/distance";
import { useRouter } from "next/navigation";
import { getShopConcepts, getShopLayouts, getShopTypes } from "@/actions/shops";

interface ShopCardProps {
    shop: Shop & { distance?: number };
    userLocation?: { latitude: number; longitude: number } | null;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
    const router = useRouter();
    const distanceText = shop.distance !== undefined ? formatDistance(shop.distance) : '距離不明';
    const [types, setTypes] = useState<ShopType[]>([]);
    const [concepts, setConcepts] = useState<ShopConcept[]>([]);
    const [layouts, setLayouts] = useState<ShopLayout[]>([]);

    useEffect(() => {
        console.log("useEffect is running");
        const fetchData = async () => {
            try {
                const [fetchedTypes, fetchedConcepts, fetchedLayouts] = await Promise.all([
                    getShopTypes(),
                    getShopConcepts(),
                    getShopLayouts()
                ]);
                if (Array.isArray(shop.types)) {
                    const shopTypes = shop.types.map((type) => {
                        if (typeof type === 'number') {
                            const matchedType = fetchedTypes.find((fetchedType) => fetchedType.id === type);
                            return matchedType ? matchedType : null;
                        } else {
                            return type;
                        }
                    }).filter((type): type is ShopType => type !== null && type !== undefined);

                    setTypes(shopTypes);
                } else {
                    console.error("shop.types is not an array:", shop.types);
                }
                setConcepts(fetchedConcepts);
                setLayouts(fetchedLayouts);
                console.log("Fetched Types:", fetchedTypes); // 追加
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const getTypeName = (id: number) => {
        const foundType = types.find(t => t.id === id);
        console.log("Type ID:", id, "Found Type:", foundType);
        return foundType?.name || 'Unknown Type';
    };
    const getConceptName = (id: number) => concepts.find(c => c.id === id)?.name || 'Unknown Concept';
    const getLayoutName = (id: number) => layouts.find(l => l.id === id)?.name || 'Unknown Layout';

    const handleShopClick = () => {
        router.push(`/shops/${shop.id}`); // ショップ詳細ページへ遷移
    };

    // shop.conceptsとshop.layoutsが存在するかどうかをチェック
    const randomConceptId = shop.concepts && shop.concepts.length > 0
      ? shop.concepts[Math.floor(Math.random() * shop.concepts.length)]
      : undefined;

    const randomLayoutId = shop.layouts && shop.layouts.length > 0
      ? shop.layouts[Math.floor(Math.random() * shop.layouts.length)]
      : undefined;


    // ConceptとLayoutを取得
    const randomConcept = typeof randomConceptId === 'number'
      ? concepts.find((c: ShopConcept) => c.id === randomConceptId) || { name: 'Unknown Concept' }
      : { name: 'Unknown Concept' };

    const randomLayout = typeof randomLayoutId === 'number'
      ? layouts.find((l: ShopLayout) => l.id === randomLayoutId) || { name: 'Unknown Layout' }
      : { name: 'Unknown Layout' };

    // コンソールで確認
    const randomConceptName = randomConcept.name;
    const randomLayoutName = randomLayout.name;

    console.log("Shop Types in Shop:", shop.types);
    console.log("Random Concept Name:", randomConceptName);
    console.log("Random Layout Name:", randomLayoutName);


    return (
        <Button
            className={styles.shopButton}
            onClick={handleShopClick}
            fullWidth
        >
            <Card className={styles.shopCard}>
                {/* ショップの名前表示 */}
                <CardHeader className={styles.cardHeader}>
                    <h1>{shop.name}</h1>
                </CardHeader>

                {/* ショップ画像 */}
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

                {/* ショップの詳細情報 */}
                <CardFooter className={styles.cardFooter}>
                    {/* 距離情報 */}
                    <div className={styles.distance}>
                        <p>現在地から{distanceText}</p>
                        <Breadcrumbs size="sm" className={styles.addressBreadcrumbs} color={"warning"}>
                            <BreadcrumbItem>{shop.address?.prefecture || '県名不明'}</BreadcrumbItem>
                            <BreadcrumbItem>{shop.address?.city || '市名不明'}</BreadcrumbItem>
                            <BreadcrumbItem>{shop.address?.town || '町名不明'}</BreadcrumbItem>
                        </Breadcrumbs>
                    </div>

                    {/* タイプ、コンセプト、レイアウトの表示 */}
                    <div className={styles.attribute}>
                        {Array.isArray(shop.types) && shop.types.every((typeId) => typeof typeId === 'number') && shop.types.map((typeId: number) => {
                            const foundType = types.find((t) => t.id === typeId);
                            const typeName = foundType ? foundType.name : 'Unknown Type';
                            console.log("Rendering Type Chip with Name:", typeName);
                            return (
                                <Chip key={typeId} className={styles.typeChip}>
                                    {typeName}
                                </Chip>
                            );
                        })}
                    </div>
                    <div className={styles.concept}>
                        <Chip className={styles.conceptChip}>
                            {randomConcept?.name}
                        </Chip>
                        <Chip className={styles.layoutChip}>
                            {randomLayout?.name}
                        </Chip>
                    </div>
                </CardFooter>
            </Card>
        </Button>
    );
};

export default ShopCard;
