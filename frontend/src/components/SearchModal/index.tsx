'use client'

import React, {useEffect, useState} from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input, Tabs, Tab
} from "@nextui-org/react";
import {ChevronDown, Eraser} from 'lucide-react';
import styles from './style.module.scss';
import DividerLine from "@/components/DividerLine";
import ConditionSearch from "@/components/ConditionSearch";
import AreaSearch from "@/components/AreaSearch";
import {getShops} from "@/actions/shops";
import {useRouter} from "next/navigation";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'condition' | 'area';
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, type }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [activeKey, setActiveKey] = useState("condition");
    const [keyword, setKeyword] = useState('');
    const [slideDirection, setSlideDirection] = useState<'left' | 'right' | ''>('');
    const [searchCount, setSearchCount] = useState(0);
    const router = useRouter();
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
    const [selectedLayouts, setSelectedLayouts] = useState<string[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
            setIsVisible(true);
        }, 300); // アニメーション時間に合わせて調整
    };

    const handleTabChange = (key: string) => {
        const prevIndex = ["condition", "reputation", "area"].indexOf(activeKey);
        const newIndex = ["condition", "reputation", "area"].indexOf(key);
        setSlideDirection(newIndex > prevIndex ? 'left' : 'right');
        setActiveKey(key);
    };

    const handleSearch = () => {
        const searchParams = new URLSearchParams();
        if (keyword) searchParams.append('keyword', keyword);
        if (selectedTypes.length > 0) searchParams.append('types', selectedTypes.join(','));
        if (selectedConcepts.length > 0) searchParams.append('concepts', selectedConcepts.join(','));
        if (selectedLayouts.length > 0) searchParams.append('layouts', selectedLayouts.join(','));
        if (selectedCity) {
            searchParams.append('region', selectedRegion!);
            searchParams.append('prefecture', selectedPrefecture!);
            searchParams.append('city', selectedCity);
        } else if (selectedPrefecture) {
            searchParams.append('region', selectedRegion!);
            searchParams.append('prefecture', selectedPrefecture);
        } else if (selectedRegion) {
            searchParams.append('region', selectedRegion);
        }
        router.push(`/shops?${searchParams.toString()}`);
        onClose();
    };

    const handleClear = () => {
        setKeyword('');
        setSelectedTypes([]);
        setSelectedConcepts([]);
        setSelectedLayouts([]);
        setSelectedRegion(null);
        setSelectedPrefecture(null);
        setSelectedCity(null);
    };

    useEffect(() => {
        const fetchSearchCount = async () => {
            // This is a mock function. Replace with actual API call.
            const count = await getShops(keyword, selectedTypes, selectedConcepts, selectedLayouts, selectedRegion, selectedPrefecture, selectedCity);
            setSearchCount(count.length);
        };
        fetchSearchCount();
    }, [keyword, selectedTypes, selectedConcepts, selectedLayouts, selectedRegion, selectedPrefecture, selectedCity]);

    useEffect(() => {
        if (slideDirection) {
            const timer = setTimeout(() => setSlideDirection(''), 300); // アニメーション時間後にリセット
            return () => clearTimeout(timer);
        }
    }, [slideDirection]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className={`${styles.modal} ${isVisible ? styles.visible : styles.hidden}`}
            classNames={{
                base: styles.modalBase,
                wrapper: styles.modalWrapper,
            }}
            size={"full"}
            scrollBehavior={"inside"}
        >
            <ModalContent>
                <ModalHeader className={styles.modalHeader}>
                    <Button isIconOnly onClick={handleClose} className={styles.closeButton}>
                        <ChevronDown />
                    </Button>
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
                    <Button isIconOnly onClick={handleClear} className={styles.clearCondition}>
                        <Eraser />
                    </Button>
                </ModalHeader>
                <DividerLine/>
                <ModalBody className={styles.bodyLayout}>
                    <div className={styles.condition}>
                        <Tabs
                            selectedKey={activeKey}
                            onSelectionChange={(key) => handleTabChange(key as string)}
                            variant="underlined"
                            className={styles.searchTab}
                            classNames={{
                                tabList: styles.tabList,
                                cursor: styles.tabCursor,
                                tab: styles.tab,
                                tabContent: styles.tabContent,
                            }}
                        >
                            <Tab key="condition" title="条件"　className={styles.tab}/>
                            <Tab key="reputation" title="口コミ"　className={styles.tab}/>
                            <Tab key="area" title="エリア"　className={styles.tab}/>
                        </Tabs>
                    </div>
                    <div className={`${styles.conditionSearch} ${styles.tabContent} ${styles[slideDirection]}`}>
                        {activeKey === "condition" &&
                            <ConditionSearch
                                selectedTypes={selectedTypes}
                                setSelectedTypes={setSelectedTypes}
                                selectedConcepts={selectedConcepts}
                                setSelectedConcepts={setSelectedConcepts}
                                selectedLayouts={selectedLayouts}
                                setSelectedLayouts={setSelectedLayouts}
                            />
                        }
                        {activeKey === "reputation" && <div className={styles.tentative}>Coming soon ...</div>}
                        {activeKey === "area" &&
                            <AreaSearch
                                selectedRegion={selectedRegion}
                                setSelectedRegion={setSelectedRegion}
                                selectedPrefecture={selectedPrefecture}
                                setSelectedPrefecture={setSelectedPrefecture}
                                selectedCity={selectedCity}
                                setSelectedCity={setSelectedCity}
                            />
                        }
                    </div>
                </ModalBody>
                <ModalFooter className={styles.footerLayout}>
                    <DividerLine/>
                    <div className={styles.footerButton}>
                        <p className={styles.searchCount}>{searchCount}件</p>
                        <Button color="primary" onClick={handleSearch} className={styles.searchButton}>
                            SEARCH
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>

    );
};

export default SearchModal;