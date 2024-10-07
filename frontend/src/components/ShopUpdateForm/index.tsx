'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ShopFormData, Shop, ShopType, ShopConcept, ShopLayout } from '../../types/shop';
import {
    updateShop,
    getShopTypes,
    getShopConcepts,
    getShopLayouts,
    getShop,
    getAddressFromPostalCode
} from '../../actions/shops';
import styles from './style.module.scss';
import { useRouter } from "next/navigation";
import { Button, Input, Select, SelectItem, Image } from "@nextui-org/react";
import CustomSelect from "@/components/CustomSelect";
import OpeningHoursInput from "@/components/OpeningHoursInput";
import { ChevronLeft } from "lucide-react";

const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県",
  "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県",
  "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

const ShopUpdateForm: React.FC<{ shopId: number }> = ({ shopId }) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [types, setTypes] = useState<ShopType[]>([]);
    const [concepts, setConcepts] = useState<ShopConcept[]>([]);
    const [layouts, setLayouts] = useState<ShopLayout[]>([]);
    const [formData, setFormData] = useState<ShopFormData>({
        name: '',
        address: {
            postal_code: '',
            prefecture: '',
            city: '',
            district: '',
            town: '',
            street_address: '',
            building: '',
        },
        phone_number: '',
        latitude: null,
        longitude: null,
        seat_count: 0,
        capacity: 0,
        opening_hours: null,
        types: [],
        concepts: [],
        layouts: [],
    });
    const [iconImageUrl, setIconImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [shopData, typesData, conceptsData, layoutsData] = await Promise.all([
                    getShop(shopId),
                    getShopTypes(),
                    getShopConcepts(),
                    getShopLayouts(),
                ]);

                const formDataFromShop: ShopFormData = {
                    name: shopData.name,
                    address: shopData.address,
                    phone_number: shopData.phone_number || '',
                    latitude: shopData.latitude,
                    longitude: shopData.longitude,
                    seat_count: shopData.seat_count,
                    capacity: shopData.capacity,
                    opening_hours: shopData.opening_hours
                        ? Object.entries(shopData.opening_hours).reduce((acc, [day, hours]) => {
                            return {
                                ...acc,
                                [day]: { ...hours, isOpen: true }
                            };
                        }, {} as ShopFormData['opening_hours'])
                        : null,
                    types: shopData.types.map(t => t.id),
                    concepts: shopData.concepts.map(c => c.id),
                    layouts: shopData.layouts.map(l => l.id),
                };
                setFormData(formDataFromShop);
                setTypes(typesData);
                setConcepts(conceptsData);
                setLayouts(layoutsData);
                if (shopData.icon_image) {
                    setIconImageUrl(shopData.icon_image);
                }
            } catch (error) {
                console.error('Error fetching shop data:', error);
            }
        };
        fetchData();
    }, [shopId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [addressField]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePostalCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, postal_code: value }
        }));
        if (value.length === 7) {
            try {
                const addressData = await getAddressFromPostalCode(value);
                setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, ...addressData }
                }));
            } catch (error) {
                console.error('Error fetching address:', error);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                icon_image: file
            }));
            setIconImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === 'authenticated') {
            try {
                const shopDataToSubmit: ShopFormData = {
                    ...formData,
                    types: formData.types,
                    concepts: formData.concepts,
                    layouts: formData.layouts,
                    icon_image: formData.icon_image instanceof File ? formData.icon_image : undefined,
                };
                console.log('Submitting updated shop data:', shopDataToSubmit);
                const updatedShop = await updateShop(shopId, shopDataToSubmit);
                console.log('Shop updated:', updatedShop);
                router.push(`/shops/${shopId}`);
            } catch (error) {
                console.error('Error updating shop:', error);
            }
        } else {
            console.error('User not authenticated');
        }
    };

    const handleBack = () => {
        router.push(`/shops/${shopId}`);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.title}>店舗情報を修正する</p>
            <div className={styles.layout}>
                <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    label="店名"
                    placeholder="店名を入力してください"
                    isClearable
                    radius="sm"
                    labelPlacement="outside"
                    isRequired
                    className={styles.inputs}
                    classNames={{
                        input: styles.inputInner,
                        inputWrapper: styles.inputWrapper
                    }}
                />

                <CustomSelect
                    name="types"
                    label="店舗タイプ"
                    options={types}
                    value={formData.types}
                    onChange={(values) => setFormData(prev => ({...prev, types: values}))}
                />

                <CustomSelect
                    name="concepts"
                    label="店舗コンセプト"
                    options={concepts}
                    value={formData.concepts}
                    onChange={(values) => setFormData(prev => ({...prev, concepts: values}))}
                />

                <CustomSelect
                    name="layouts"
                    label="店舗レイアウト"
                    options={layouts}
                    value={formData.layouts}
                    onChange={(values) => setFormData(prev => ({...prev, layouts: values}))}
                />

                <div className={styles.iconImageContainer}>
                    {iconImageUrl && (
                        <Image
                            src={iconImageUrl}
                            alt="Shop Icon"
                            width={100}
                            height={100}
                        />
                    )}
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        label="アイコン画像"
                        accept="image/*"
                        className={styles.inputs}
                        radius="sm"
                        classNames={{
                            input: styles.inputInner,
                            inputWrapper: styles.inputWrapper
                        }}
                    />
                </div>

                <Input
                    name="address.postal_code"
                    value={formData.address.postal_code}
                    onChange={handlePostalCodeChange}
                    label="郵便番号"
                    placeholder="0000000"
                    isClearable
                    radius="sm"
                    labelPlacement="outside"
                    isRequired
                    className={styles.inputs}
                    classNames={{
                        input: styles.inputInner,
                        inputWrapper: styles.inputWrapper
                    }}
                />

                <Select
                    name="address.prefecture"
                    label="都道府県"
                    placeholder="都道府県を選択してください"
                    selectedKeys={formData.address.prefecture ? [formData.address.prefecture] : []}
                    onChange={(e) => handleChange({
                        target: {
                            name: 'address.prefecture',
                            value: e.target.value
                        }
                    } as React.ChangeEvent<HTMLInputElement>)}
                    className={styles.inputs}
                    classNames={{
                        base: styles.select,
                        trigger: styles.selectTrigger,
                        value: styles.selectValue,
                    }}
                    labelPlacement="outside"
                    radius="sm"
                    isRequired
                >
                    {prefectures.map((pref) => (
                        <SelectItem key={pref} value={pref}>
                            {pref}
                        </SelectItem>
                    ))}
                </Select>

                <Input
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    label="市区町村"
                    placeholder="市区町村を入力してください"
                    isClearable
                    radius="sm"
                    labelPlacement="outside"
                    isRequired
                    className={styles.inputs}
                    classNames={{
                        input: styles.inputInner,
                        inputWrapper: styles.inputWrapper
                    }}
                />

                <Input
                    name="address.street_address"
                    value={formData.address.street_address}
                    onChange={handleChange}
                    label="番地"
                    placeholder="番地を入力してください"
                    isClearable
                    radius="sm"
                    labelPlacement="outside"
                    isRequired
                    className={styles.inputs}
                    classNames={{
                        input: styles.inputInner,
                        inputWrapper: styles.inputWrapper
                    }}
                />

                <Input
                    name="address.building"
                    value={formData.address.building}
                    onChange={handleChange}
                    label="建物名・部屋番号"
                    placeholder="建物名・部屋番号を入力してください"
                    isClearable
                    radius="sm"
                    labelPlacement="outside"
                    className={styles.inputs}
                    classNames={{
                        input: styles.inputInner,
                        inputWrapper: styles.inputWrapper
                    }}
                />

                <Input
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number || ''}
                    onChange={handleChange}
                    label="電話番号"
                    labelPlacement="outside"
                    placeholder="XXXXXXXXXXX"
                    radius="sm"
                    className={styles.inputs}
                    classNames={{
                        input: styles.inputInner,
                        inputWrapper: styles.inputWrapper
                    }}
                />

                <div className={styles.coordinates}>
                    <Input
                        name="latitude"
                        value={formData.latitude !== null ? formData.latitude.toString() : ''}
                        onChange={handleChange}
                        label="緯度"
                        placeholder="XX.XXXXXX"
                        isClearable
                        radius="sm"
                        labelPlacement="outside"
                        className={styles.coordinate}
                        classNames={{
                            input: styles.inputInner,
                            inputWrapper: styles.inputWrapper
                        }}
                    />
                    <Input
                        name="longitude"
                        value={formData.longitude !== null ? formData.longitude.toString() : ''}
                        onChange={handleChange}
                        label="経度"
                        placeholder="XX.XXXXXX"
                        isClearable
                        radius="sm"
                        labelPlacement="outside"
                        className={styles.coordinate}
                        classNames={{
                            input: styles.inputInner,
                            inputWrapper: styles.inputWrapper
                        }}
                    />
                </div>

                <Input
                    name="seat_count"
                    value={formData.seat_count.toString()}
                    onChange={handleChange}
                    label="席数"
                    type="number"
                    radius="sm"
                    labelPlacement="outside"
                    className={styles.inputs}
                    classNames={{
                        input: styles.inputInner,
                        inputWrapper: styles.inputWrapper
                    }}
                />

                <Input
                    name="capacity"
                    value={formData.capacity.toString()}
                    onChange={handleChange}
                    label="収容人数"
                    labelPlacement="outside"
                    type="number"
                    radius="sm"
                    className={styles.inputs}
                    classNames={{
                        input: styles.inputInner,
                        inputWrapper: styles.inputWrapper
                    }}
                />

                <div className={styles.openHours}>
                    <OpeningHoursInput
                        value={formData.opening_hours || {
                            月: {open: '', close: '', isOpen: false},
                            火: {open: '', close: '', isOpen: false},
                            水: {open: '', close: '', isOpen: false},
                            木: {open: '', close: '', isOpen: false},
                            金: {open: '', close: '', isOpen: false},
                            土: {open: '', close: '', isOpen: false},
                            日: {open: '', close: '', isOpen: false}
                        }}
                        onChange={(newOpeningHours) => setFormData(prev => ({...prev, opening_hours: newOpeningHours}))}
                    />
                </div>
            </div>
            <footer className={styles.footer}>
                <div className={styles.footerLeft}>
                    <Button isIconOnly onClick={handleBack} className={styles.backButton}>
                        <ChevronLeft/>
                    </Button>
                </div>
                <div className={styles.footerRight}>
                    <Button type="submit" className={styles.button}>
                        Update Shop
                    </Button>
                </div>
            </footer>
        </form>
    );
};

export default ShopUpdateForm;