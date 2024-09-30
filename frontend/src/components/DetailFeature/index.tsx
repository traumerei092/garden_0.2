import React, { useEffect, useState } from 'react'
import styles from "./style.module.scss";
import {Chip, Image} from "@nextui-org/react";
import { Shop, ShopType, ShopConcept, ShopLayout } from "@/types/shop";
import { getShopTypes, getShopConcepts, getShopLayouts } from "@/actions/shops";

interface DetailFeatureProps {
    shop: Shop;
}

const DetailFeature: React.FC<DetailFeatureProps> = ({ shop }) => {
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

    return (
        <div className={styles.layout}>
            <div className={styles.shopImageFrame}>
                {shop.icon_image && (
                    <Image
                        src={shop.icon_image}
                        alt={shop.name}
                        className={styles.shopImage}
                    />
                )}
                <div className={styles.imageOverlay}></div>
            </div>
            <div className={styles.featureContainer}>
                <div className={styles.featureSection}>
                    <h3 className={styles.featureTitle}>タイプ</h3>
                    <div className={styles.chipContainer}>
                        {shop.types && shop.types.map((type) => (
                            <Chip key={type.id.toString()} className={styles.typeChip}>
                                {getTypeName(type.id)}
                            </Chip>
                        ))}
                    </div>
                </div>
                <div className={styles.featureSection}>
                    <h3 className={styles.featureTitle}>コンセプト</h3>
                    <div className={styles.chipContainer}>
                        {shop.concepts && shop.concepts.map((concept) => (
                            <Chip key={concept.id.toString()} className={styles.conceptChip}>
                                {getConceptName(concept.id)}
                            </Chip>
                        ))}
                    </div>
                </div>
                <div className={styles.featureSection}>
                    <h3 className={styles.featureTitle}>レイアウト</h3>
                    <div className={styles.chipContainer}>
                        {shop.layouts && shop.layouts.map((layout) => (
                            <Chip key={layout.id.toString()} className={styles.layoutChip}>
                                {getLayoutName(layout.id)}
                            </Chip>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailFeature