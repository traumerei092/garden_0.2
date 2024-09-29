import React, { useEffect, useState } from 'react'
import styles from "./style.module.scss";
import {Chip, Image} from "@nextui-org/react";
import { Shop, ShopType, ShopConcept, ShopLayout } from "@/types/shop";
import { getShopTypes, getShopConcepts, getShopLayouts } from "@/actions/shops";
import {Clock, MapPin, Phone, Users} from "lucide-react";

interface DetailProfileProps {
    shop: Shop;
}

const DetailProfile: React.FC<DetailProfileProps> = ({ shop }) => {

    return (
        <div className={styles.profileContainer}>
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <MapPin className={styles.icon}/>
                    <div>
                        <h4>住所</h4>
                        <p>{`${shop.address.prefecture}${shop.address.city}${shop.address.town}${shop.address.street_address}`}</p>
                        {shop.address.building && <p>{shop.address.building}</p>}
                    </div>
                </div>
                <div className={styles.infoItem}>
                    <Phone className={styles.icon}/>
                    <div>
                        <h4>電話番号</h4>
                        <p>{shop.phone_number || '登録なし'}</p>
                    </div>
                </div>
                <div className={styles.infoItem}>
                    <Clock className={styles.icon}/>
                    <div>
                        <h4>営業時間</h4>
                        {Object.entries(shop.opening_hours).map(([day, hours]) => (
                            <p key={day}>{`${day}: ${hours.open} - ${hours.close}`}</p>
                        ))}
                    </div>
                </div>
                <div className={styles.infoItem}>
                    <Users className={styles.icon}/>
                    <div>
                        <h4>座席数</h4>
                        <p>{`${shop.seat_count}席`}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailProfile