'use client'

import React, { useEffect, useState } from 'react';
import {useParams, useRouter} from 'next/navigation';
import { Shop } from '@/types/shop';
import { getShopById } from '@/actions/shops';
import styles from "./style.module.scss";
import {Button, Image, Tab, Tabs} from "@nextui-org/react";
import {Check, ChevronDown, ChevronLeft, MapPinnedIcon, Martini, StarIcon} from "lucide-react";
import {router} from "next/client";
import DividerLine from "@/components/DividerLine";
import DetailFeature from "@/components/DetailFeature";
import DetailProfile from "@/components/DetailProfile";
import DetailReview from "@/components/DetailReview";
import ReviewModal from "@/components/ReviewModal";  // この関数は後で実装する必要があります

export default function ShopDetail() {
    const params = useParams();
    const router = useRouter();
    const [shop, setShop] = useState<Shop | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeKey, setActiveKey] = useState("condition");
    const [slideDirection, setSlideDirection] = useState<'left' | 'right' | ''>('');
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const handleTabChange = (key: string) => {
        const prevIndex = ["feature", "reputation", "profile"].indexOf(activeKey);
        const newIndex = ["feature", "reputation", "profile"].indexOf(key);
        setSlideDirection(newIndex > prevIndex ? 'left' : 'right');
        setActiveKey(key);
    };

    useEffect(() => {
        const fetchShop = async () => {
            if (params?.id) {
                try {
                    const shopId = Array.isArray(params.id) ? params.id[0] : params.id;
                    const fetchedShop = await getShopById(Number(shopId));
                    setShop(fetchedShop);
                    setLoading(false);
                } catch (err) {
                    console.error('Error fetching shop:', err);
                    setError('Failed to fetch shop details');
                    setLoading(false);
                }
            } else {
                setError('Shop ID is missing');
                setLoading(false);
            }
        };

        fetchShop();
    }, [params?.id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!shop) return <div>Shop not found</div>;

    const handleBack = () => {
        router.push(`/shops`);  // ショップの詳細ページへのパスを適切に設定してください
    };

    return (
        <>
            <div className={styles.shopHeader}>
                <div className={styles.headerLeft}>
                    <Button isIconOnly onClick={handleBack} className={styles.backButton}>
                        <ChevronLeft/>
                    </Button>
                </div>
                <div className={styles.headerCenter}>
                    <h1 className={styles.shopName}>{shop.name}</h1>
                </div>
                <div className={styles.headerRight}>
                    <Button isIconOnly onClick={handleBack} className={styles.backButton}>
                        <MapPinnedIcon/>
                    </Button>
                </div>
            </div>
            <div className={styles.tabFrame}>
                <Tabs
                    selectedKey={activeKey}
                    onSelectionChange={(key) => handleTabChange(key as string)}
                    variant="underlined"
                    className={styles.detailTab}
                    classNames={{
                        tabList: styles.tabList,
                        cursor: styles.tabCursor,
                        tab: styles.tab,
                        tabContent: styles.tabContent,
                    }}
                >
                    <Tab key="feature" title="特徴" className={styles.tab}/>
                    <Tab key="reputation" title="口コミ" className={styles.tab}/>
                    <Tab key="profile" title="基本情報" className={styles.tab}/>
                </Tabs>
            </div>
            <div className={`${styles.tabContent} ${styles[slideDirection]}`}>
                {activeKey === "feature" && <DetailFeature shop={shop}/>}
                {activeKey === "reputation" && <DetailReview shopId={shop.id} />}
                {activeKey === "profile" && <DetailProfile shop={shop}/>}
            </div>
            <footer className={styles.footer}>
                <DividerLine/>
                <div className={styles.footerContainer}>
                    <Button className={styles.favorite}>
                        <Check className={styles.icon}/>
                        <p>気になる</p>
                    </Button>
                    <Button className={styles.reputation} onClick={() => setIsReviewModalOpen(true)}>
                        <Martini className={styles.icon}/>
                        <p>魅力を伝える</p>
                    </Button>
                    <Button className={styles.regular}>
                        <StarIcon className={styles.icon}/>
                        <p>行きつけ</p>
                    </Button>
                </div>
            </footer>
            {shop && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    shopId={shop.id}
                />
            )}
        </>
    );
}