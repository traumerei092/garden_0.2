import React, { useState, useEffect } from 'react'
import styles from "./style.module.scss";
import {Button} from "@nextui-org/react";
import {CirclePlus} from "lucide-react";
import {useRouter} from "next/navigation";

const CreateShop = () => {

    const router = useRouter();
    const handleNavigation = () => {
        router.push('/shops/create');
    };

    return (
        <Button
            isIconOnly
            onClick={handleNavigation}
            className={styles.createButton}
        >
            <CirclePlus className={styles.circlePlus} strokeWidth={1.5}/>
        </Button>
    )
}

export default CreateShop