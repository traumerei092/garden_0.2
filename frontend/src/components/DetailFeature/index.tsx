import React, { useEffect, useState } from 'react'
import styles from "./style.module.scss";
import {Button, Chip, Image} from "@nextui-org/react";
import { Shop, ShopType, ShopConcept, ShopLayout } from "@/types/shop";
import { getShopTypes, getShopConcepts, getShopLayouts } from "@/actions/shops";
import {useRouter} from "next/navigation";

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
    const router = useRouter();

    const handleUpdate = () => {
        router.push(`/shops/${shop.id}/update`);
    };

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
                // shop.typesがnumber[]であることを確認
                const shopTypes = shop.types.map((type) => {
                    if (typeof type === 'number') {
                        // numberの場合の処理
                        const matchedType = fetchedTypes.find((fetchedType) => fetchedType.id === type);
                        return matchedType ? matchedType : null; // matchedTypeが見つからない場合はnull
                    } else {
                        // すでにオブジェクトの場合（ShopType[]の場合）
                        return type;
                    }
                }).filter((type): type is ShopType => type !== null && type !== undefined); // nullやundefinedを除去

                setTypes(shopTypes);
            } else {
                console.error("shop.types is not an array:", shop.types);
            }

            // コンセプトの処理
            if (Array.isArray(shop.concepts)) {
                const shopConcepts: ShopConcept[] = shop.concepts.map((concept) => {
                    if (typeof concept === 'number') {
                        const matchedConcept = fetchedConcepts.find((fetchedConcept) => fetchedConcept.id === concept);
                        return matchedConcept ? matchedConcept : null;
                    } else {
                        return concept as ShopConcept;
                    }
                }).filter((concept): concept is ShopConcept => concept !== null && concept !== undefined);

                setConcepts(shopConcepts);
            } else {
                console.error("shop.concepts is not an array:", shop.concepts);
            }

            // レイアウトの処理
            if (Array.isArray(shop.layouts)) {
                const shopLayouts: ShopLayout[] = shop.layouts.map((layout) => {
                    if (typeof layout === 'number') {
                        const matchedLayout = fetchedLayouts.find((fetchedLayout) => fetchedLayout.id === layout);
                        return matchedLayout ? matchedLayout : null;
                    } else {
                        return layout as ShopLayout;
                    }
                }).filter((layout): layout is ShopLayout => layout !== null && layout !== undefined);

                setLayouts(shopLayouts);
            } else {
                console.error("shop.layouts is not an array:", shop.layouts);
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
            <div className={styles.updateShop}>
                <Button className={styles.updateButton} onClick={handleUpdate}>
                    情報を修正する
                </Button>
            </div>
        </div>
    )
}

export default DetailFeature