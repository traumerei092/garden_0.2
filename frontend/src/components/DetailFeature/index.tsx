import React, { useEffect, useState } from 'react'
import styles from "./style.module.scss";
import {Chip, Image} from "@nextui-org/react";
import { Shop, ShopType, ShopConcept, ShopLayout } from "@/types/shop";
import { getShopTypes, getShopConcepts, getShopLayouts } from "@/actions/shops";

// 共通のマッピング処理を関数化
function mapToFetchedEntities<T>(shopIds: number[], fetchedEntities: T[], getId: (entity: T) => number) {
    return shopIds
        .map((id) => {
            const matchedEntity = fetchedEntities.find((entity) => getId(entity) === id);
            if (matchedEntity) {
                return matchedEntity;
            } else {
                console.warn(`ID ${id} not found in fetchedEntities`);
                return null;
            }
        })
        .filter(Boolean) as T[];
}

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

            console.log("Shop Types:", shop.types);
            console.log("Fetched Types:", fetchedTypes);

            if (Array.isArray(shop.types)) {
                const shopTypes = mapToFetchedEntities(shop.types as number[], fetchedTypes, (type) => type.id);
                setTypes(shopTypes);
            }

            if (Array.isArray(shop.concepts)) {
                const shopConcepts = mapToFetchedEntities(shop.concepts as number[], fetchedConcepts, (concept) => concept.id);
                setConcepts(shopConcepts);
            }

            if (Array.isArray(shop.layouts)) {
                const shopLayouts = mapToFetchedEntities(shop.layouts as number[], fetchedLayouts, (layout) => layout.id);
                setLayouts(shopLayouts);
            }
        };
        fetchData();
    }, [shop.types]);

    const getTypeName = (id: number) => types.find(t => t.id === id)?.name || 'Unknown Type';
    const getConceptName = (id: number) => concepts.find(c => c.id === id)?.name || 'Unknown Concept';
    const getLayoutName = (id: number) => layouts.find(l => l.id === id)?.name || 'Unknown Layout';

    console.log("Shop Types:", shop.types);
    console.log("Shop Concepts:", shop.concepts);
    console.log("Shop Layouts:", shop.layouts);

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
                        {types.map((type) => (
                            <Chip key={type.id.toString()} className={styles.typeChip}>
                                {type.name}
                            </Chip>
                        ))}
                    </div>
                </div>
                <div className={styles.featureSection}>
                    <h3 className={styles.featureTitle}>コンセプト</h3>
                    <div className={styles.chipContainer}>
                        {concepts.map((concept) => (
                            <Chip key={concept.id.toString()} className={styles.conceptChip}>
                                {concept.name}
                            </Chip>
                        ))}
                    </div>
                </div>
                <div className={styles.featureSection}>
                    <h3 className={styles.featureTitle}>レイアウト</h3>
                    <div className={styles.chipContainer}>
                        {layouts.map((layout) => (
                            <Chip key={layout.id.toString()} className={styles.layoutChip}>
                                {layout.name}
                            </Chip>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailFeature