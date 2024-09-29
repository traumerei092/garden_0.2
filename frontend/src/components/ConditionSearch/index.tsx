import React, { useState, useEffect } from 'react'
import styles from "./style.module.scss";
import {Checkbox, CheckboxGroup, Chip} from "@nextui-org/react";
import {ShopConcept, ShopLayout, ShopType} from "@/types/shop";
import {getShopConcepts, getShopLayouts, getShopTypes} from "@/actions/shops";

interface ConditionSearchProps {
    selectedTypes: string[];
    setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
    selectedConcepts: string[];
    setSelectedConcepts: React.Dispatch<React.SetStateAction<string[]>>;
    selectedLayouts: string[];
    setSelectedLayouts: React.Dispatch<React.SetStateAction<string[]>>;
}

const ConditionSearch: React.FC<ConditionSearchProps> = ({
    selectedTypes, setSelectedTypes,
    selectedConcepts, setSelectedConcepts,
    selectedLayouts, setSelectedLayouts
}) => {
    const [types, setTypes] = useState<ShopType[]>([]);
    const [concepts, setConcepts] = useState<ShopConcept[]>([]);
    const [layouts, setLayouts] = useState<ShopLayout[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedTypes, fetchedConcepts, fetchedLayouts] = await Promise.all([
                    getShopTypes(),
                    getShopConcepts(),
                    getShopLayouts()
                ]);
                setTypes(fetchedTypes);
                setConcepts(fetchedConcepts);
                setLayouts(fetchedLayouts);
            } catch (error) {
                console.error('Error fetching shop data:', error);
            }
        };

        fetchData();
    }, []);

    const toggleSelection = (
        currentSelection: string[],
        setSelection: React.Dispatch<React.SetStateAction<string[]>>,
        value: string
    ) => {
        if (currentSelection.includes(value)) {
            setSelection(currentSelection.filter(item => item !== value));
        } else {
            setSelection([...currentSelection, value]);
        }
    };

    const customChipStyles = {
        base: "border border-solid",
        content: "text-white",
    };

    const renderChips = (
        items: (ShopType | ShopConcept | ShopLayout)[],
        selectedItems: string[],
        setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        return items.map((item) => (
            <Chip
                key={item.id}
                classNames={customChipStyles}
                className={selectedItems.includes(item.id.toString()) ? styles.selectedChip : styles.defaultChip}
                onClick={() => toggleSelection(selectedItems, setSelectedItems, item.id.toString())}
            >
                {item.name}
            </Chip>
        ));
    };

    return (
        <div className={styles.layout}>
            <div className={styles.searchBlock}>
                <div className={styles.searchTitle}>
                    <p>ジャンル</p>
                </div>
                <div className={styles.searchItem}>
                    {renderChips(types, selectedTypes, setSelectedTypes)}
                </div>
            </div>
            <div className={styles.searchBlock}>
                <div className={styles.searchTitle}>
                    <p>特徴</p>
                </div>
                <div className={styles.searchItem}>
                    {renderChips(concepts, selectedConcepts, setSelectedConcepts)}
                </div>
            </div>
            <div className={styles.searchBlock}>
                <div className={styles.searchTitle}>
                    <p>レイアウト</p>
                </div>
                <div className={styles.searchItem}>
                    {renderChips(layouts, selectedLayouts, setSelectedLayouts)}
                </div>
            </div>
        </div>
    )
}

export default ConditionSearch