'use client'

import React, { useState, useEffect } from 'react'
import styles from "./style.module.scss";
import {Button, Input, Link} from "@nextui-org/react";
import gardenLogo from "../../../public/images/garden_logo_orkney_font_fixed.png";
import Image from "next/image";
import {MapPinIcon, SearchIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import SearchModal from "@/components/SearchModal";

const SearchForm = () => {

    useEffect(() => {
    const fetchData = async () => {
      // Djangoのshopsエンドポイントにリクエストを送る
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shops/`);
      const data = await response.json();
      console.log(data); // データが正しく取得されるか確認
    };

    fetchData(); // ページ読み込み時に実行
  }, []);

    const [activeButton, setActiveButton] = useState('keyword');
    const [isLoading, setIsLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'condition' | 'area'>('condition');
    const [initialActiveKey, setInitialActiveKey] = useState("condition");

    const router = useRouter();
    const handleNavigation = () => {
        router.push('/shops');
    };

    const handleSearch = () => {
        if (keyword.trim()) {
            router.push(`/shops?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    };

    const handleLocationSearch = () => {
        setIsLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    router.push(`/shops?lat=${latitude}&lon=${longitude}`);
                },
                error => {
                    console.error("Error getting location:", error);
                    alert("位置情報の取得に失敗しました。設定を確認してください。");
                    setIsLoading(false);
                }
            );
        } else {
            alert("お使いのブラウザは位置情報をサポートしていません。");
            setIsLoading(false);
        }
    };

    const openModal = (type: 'condition' | 'area') => {
        setModalType(type);
        setIsModalOpen(true);
        setActiveButton(type);
        setInitialActiveKey(type === 'area' ? 'area' : 'condition');
    };

    return (
        <div className={styles.layout}>
            <div className={styles.message}>
                <p>「行きつけのBar」が見つかる</p>
            </div>
            <div className={styles.logo}>
                <Image src={gardenLogo} alt="Garden Logo" />
            </div>
            <div className={styles.condition}>
                <Button
                    radius="none"
                    className={`${styles.button} ${activeButton === 'condition' ? styles.active : ''}`}
                    onClick={() => openModal('condition')}
                >
                    条件で探す
                </Button>
                <Button
                    radius="none"
                    className={`${styles.button} ${activeButton === 'keyword' ? styles.active : ''}`}
                    onClick={() => setActiveButton('keyword')}
                >
                    キーワードで探す
                </Button>
                <Button
                    radius="none"
                    className={`${styles.button} ${activeButton === 'area' ? styles.active : ''}`}
                    onClick={() => openModal('area')}
                >
                    エリアで探す
                </Button>
            </div>
            <div className={styles.input}>
                <Input
                    placeholder="店名、条件、エリアなど"
                    className={styles.inputText}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    isClearable
                    classNames={{
                      base: styles.inputBase,
                      mainWrapper: styles.inputMainWrapper,
                      input: styles.inputInner,
                      inputWrapper: styles.inputWrapper
                    }}
                  />
                <Button
                    isIconOnly
                    aria-label="Search"
                    className={styles.inputButton}
                    radius="none"
                    onClick={handleSearch}
                >
                    <SearchIcon/>
                </Button>
            </div>
            <div className={styles.outerLocation}>
                <Button
                  color="primary"
                  startContent={<MapPinIcon />}
                  className={styles.innerLocation}
                  radius="sm"
                  onClick={handleLocationSearch}
                  isLoading={isLoading}
                >
                  現在地から探す
                </Button>
            </div>
            <SearchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={modalType}
                initialActiveKey={initialActiveKey}
            />
        </div>
    )
}

export default SearchForm