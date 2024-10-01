'use client'

import React, { useState, useEffect } from 'react'
import styles from "./style.module.scss";
import {Button, Chip, Input} from "@nextui-org/react";
import {CirclePlus} from "lucide-react";
import {useRouter, useSearchParams} from "next/navigation";
import {getShopConcepts, getShopLayouts, getShopTypes} from "@/actions/shops";

const SearchConditions = () => {
    const [keyword, setKeyword] = useState('');
    const [types, setTypes] = useState<string[]>([]);
    const [concepts, setConcepts] = useState<string[]>([]);
    const [layouts, setLayouts] = useState<string[]>([]);
    const [area, setArea] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchConditionNames = async () => {
            if (searchParams) { // null チェック
                const keywordParam = searchParams.get('keyword');
                const typesParam = searchParams.get('types');
                const conceptsParam = searchParams.get('concepts');
                const layoutsParam = searchParams.get('layouts');
                const regionParam = searchParams.get('region');
                const prefectureParam = searchParams.get('prefecture');
                const cityParam = searchParams.get('city');

                if (keywordParam) setKeyword(decodeURIComponent(keywordParam));

                if (typesParam) {
                    const typeIds = decodeURIComponent(typesParam).split(',');
                    const allTypes = await getShopTypes();
                    setTypes(typeIds.map(id => allTypes.find(t => t.id.toString() === id)?.name || ''));
                }

                if (conceptsParam) {
                    const conceptIds = decodeURIComponent(conceptsParam).split(',');
                    const allConcepts = await getShopConcepts();
                    setConcepts(conceptIds.map(id => allConcepts.find(c => c.id.toString() === id)?.name || ''));
                }

                if (layoutsParam) {
                    const layoutIds = decodeURIComponent(layoutsParam).split(',');
                    const allLayouts = await getShopLayouts();
                    setLayouts(layoutIds.map(id => allLayouts.find(l => l.id.toString() === id)?.name || ''));
                }

                if (cityParam) {
                    setArea(`${regionParam} > ${prefectureParam} > ${cityParam}`);
                } else if (prefectureParam) {
                    setArea(`${regionParam} > ${prefectureParam}`);
                } else if (regionParam) {
                    setArea(regionParam);
                }
            }
        };

        fetchConditionNames();
    }, [searchParams]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        router.push(`/shops?${params.toString()}`);
    };

    const typeChipStyle = {
        background: "rgba(235, 14, 242, 0.4)",
        border: "0.5px solid rgba(235, 14, 242, 1)",
        color: "white",
        height: "1.5rem",
        margin: "0 5px 5px 0"
    };

    const conceptChipStyle = {
        background: "rgba(0, 198, 255, 0.4)",
        border: "0.5px solid rgba(0, 198, 255, 1)",
        color: "white",
        height: "1.5rem",
        margin: "0 5px 5px 0"
    };

    const layoutChipStyle = {
        background: "rgba(255, 174, 0, 0.4)",
        border: "0.5px solid rgba(255, 174, 0, 1)",
        color: "white",
        height: "1.5rem",
        margin: "0 5px 5px 0"
    };

    return (
        <div className={styles.layout}>
            <div className={styles.conditionArea}>
                <div className={styles.condition}>
                    <p className={styles.title}>条件</p>
                    <p className={styles.explanation}>追加する</p>
                    <Button isIconOnly className={styles.button} size="sm">
                        <CirclePlus className={styles.circlePlus}/>
                    </Button>
                </div>
                <div className={styles.area}>
                    <p className={styles.title}>エリア</p>
                    <p className={styles.explanation}>変更する</p>
                    <Button isIconOnly className={styles.button} size="sm">
                        <CirclePlus className={styles.circlePlus}/>
                    </Button>
                </div>
            </div>
            <div className={styles.keyword}>
                <div className={styles.keywordArea}>
                    <p className={styles.keywordTitle}>キーワード</p>
                    <Input
                        className={styles.keywordContent}
                        classNames={{
                          input: styles.transparentInput,
                          inputWrapper: styles.transparentInputWrapper
                        }}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.searchButtonArea}>
                <Button className={styles.searchButton} onClick={handleSearch}>
                    SEARCH
                </Button>
            </div>
            <div className={styles.selectedArea}>
                {area && <Chip className={styles.areaChip}>{area}</Chip>}
            </div>
            <div className={styles.selectedConditions}>
                {types.map(type => (
                    <Chip key={`type-${type}`} style={typeChipStyle}>{type}</Chip>
                ))}
                {concepts.map(concept => (
                    <Chip key={`concept-${concept}`} style={conceptChipStyle}>{concept}</Chip>
                ))}
                {layouts.map(layout => (
                    <Chip key={`layout-${layout}`} style={layoutChipStyle}>{layout}</Chip>
                ))}
            </div>

        </div>
    )
}

export default SearchConditions