import React, { useEffect } from 'react'
import styles from "./style.module.scss";
import { Accordion, AccordionItem, RadioGroup, Radio } from "@nextui-org/react";
import japanRegions from './japanRegions';

interface AreaSearchProps {
    selectedRegion: string | null;
    setSelectedRegion: React.Dispatch<React.SetStateAction<string | null>>;
    selectedPrefecture: string | null;
    setSelectedPrefecture: React.Dispatch<React.SetStateAction<string | null>>;
    selectedCity: string | null;
    setSelectedCity: React.Dispatch<React.SetStateAction<string | null>>;
}

const AreaSearch: React.FC<AreaSearchProps> = ({
    selectedRegion,
    setSelectedRegion,
    selectedPrefecture,
    setSelectedPrefecture,
    selectedCity,
    setSelectedCity
}) => {
    const handleRegionSelect = (region: string) => {
        setSelectedRegion(region);
        setSelectedPrefecture(null);
        setSelectedCity(null);
    };

    const handlePrefectureSelect = (prefecture: string) => {
        setSelectedPrefecture(prefecture);
        setSelectedCity(null);
    };

    const handleCitySelect = (city: string) => {
        setSelectedCity(city);
    };

    useEffect(() => {
        // This effect is to ensure that when a region is deselected,
        // the prefecture and city are also deselected
        if (!selectedRegion) {
            setSelectedPrefecture(null);
            setSelectedCity(null);
        }
    }, [selectedRegion, setSelectedPrefecture, setSelectedCity]);

    useEffect(() => {
        // This effect is to ensure that when a prefecture is deselected,
        // the city is also deselected
        if (!selectedPrefecture) {
            setSelectedCity(null);
        }
    }, [selectedPrefecture, setSelectedCity]);

    return (
        <div className={styles.layout}>
            <Accordion variant="light" className={styles.areaAccordion}>
                {Object.entries(japanRegions).map(([region, prefectures]) => (
                    <AccordionItem key={region} aria-label={region} title={region} className={styles.areaItem}>
                        <RadioGroup value={selectedRegion} onValueChange={handleRegionSelect} className={styles.radioGroup}>
                            <Radio value={region}>{region}</Radio>
                        </RadioGroup>
                        {selectedRegion === region && (
                            <Accordion variant="light" className={styles.prefectureAccordion}>
                                {Object.entries(prefectures).map(([prefecture, cities]) => (
                                    <AccordionItem key={prefecture} aria-label={prefecture} title={prefecture} className={styles.prefectureItem}>
                                        <RadioGroup value={selectedPrefecture} onValueChange={handlePrefectureSelect} className={styles.radioGroup}>
                                            <Radio value={prefecture}>{prefecture}</Radio>
                                        </RadioGroup>
                                        {selectedPrefecture === prefecture && (
                                            <RadioGroup value={selectedCity} onValueChange={handleCitySelect} className={styles.radioGroup}>
                                                {cities.map(city => (
                                                    <Radio key={city} value={city} className={styles.radio}>{city}</Radio>
                                                ))}
                                            </RadioGroup>
                                        )}
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default AreaSearch;