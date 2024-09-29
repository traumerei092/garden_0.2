'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ShopFormData, ShopType, ShopConcept, ShopLayout, Address } from '../../types/shop';
import { createShop, getShopTypes, getShopConcepts, getShopLayouts, getAddressFromPostalCode } from '../../actions/shops';
import styles from './style.module.scss';
import {useRouter} from "next/navigation";
import {Button, Input, Select, SelectItem} from "@nextui-org/react";
import CustomSelect from "@/components/CustomSelect";
import OpeningHoursInput from "@/components/OpeningHoursInput";

const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県",
  "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県",
  "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

const ShopCreateForm: React.FC = () => {
    const router = useRouter();

    const { data: session, status } = useSession();
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
        phone_number: '', // 新しく追加
        latitude: '',
        longitude: '',
        seat_count: 0,
        capacity: 0,
        opening_hours: {},
        types: [],
        concepts: [],
        layouts: [],
    });
    const [types, setTypes] = useState<ShopType[]>([]);
    const [concepts, setConcepts] = useState<ShopConcept[]>([]);
    const [layouts, setLayouts] = useState<ShopLayout[]>([]);
    const [iconImage, setIconImage] = useState<File | null>(null);

    useEffect(() => {
        const fetchData = async () => {
          const [typesData, conceptsData, layoutsData] = await Promise.all([
            getShopTypes(),
            getShopConcepts(),
            getShopLayouts(),
          ]);
          setTypes(typesData);
          setConcepts(conceptsData);
          setLayouts(layoutsData);
        };
        fetchData();
    }, []);

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
          setIconImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === 'authenticated') {
          try {
            const shopDataToSubmit: ShopFormData = {
              ...formData,
              types: formData.types.map(Number),
              concepts: formData.concepts.map(Number),
              layouts: formData.layouts.map(Number),
              icon_image: iconImage || undefined,
            };
            const newShop = await createShop(shopDataToSubmit);
            console.log('New shop created:', newShop);
            router.push('/shops');
          } catch (error) {
            console.error('Error creating shop:', error);
            // TODO: Add error message
          }
        } else {
          console.error('User not authenticated');
          // TODO: Add error message
        }
    };

  return (
      <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.layout}>
                <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    label={"店名"}
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
                    errorMessage="店名を入力してください"
                />

                <CustomSelect
                    name="types"
                    label="店舗タイプ"
                    options={types}
                    value={formData.types}
                    onChange={(values) => setFormData(prev => ({ ...prev, types: values }))}
                />

                <CustomSelect
                    name="concepts"
                    label="店舗コンセプト"
                    options={concepts}
                    value={formData.concepts}
                    onChange={(values) => setFormData(prev => ({ ...prev, concepts: values }))}
                />

                <CustomSelect
                    name="layouts"
                    label="店舗レイアウト"
                    options={layouts}
                    value={formData.layouts}
                    onChange={(values) => setFormData(prev => ({ ...prev, layouts: values }))}
                />

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
                    value={formData.address.prefecture}
                    onChange={(e) => handleChange({ target: { name: 'address.prefecture', value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
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
                    type={"tel"}
                    value={formData.phone_number}
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
                    value={formData.latitude}
                    onChange={handleChange}
                    label={"緯度"}
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
                    value={formData.longitude}
                    onChange={handleChange}
                    label={"経度"}
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
                    label={"席数"}
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

                <OpeningHoursInput
                    value={formData.opening_hours}
                    onChange={(newOpeningHours) => setFormData(prev => ({ ...prev, opening_hours: newOpeningHours }))}
                />

                <Button type="submit" className={styles.button}>
                    Create Shop
                </Button>
          </div>
      </form>
  );
};

export default ShopCreateForm;