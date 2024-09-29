import React from 'react'
import styles from "./style.module.scss";
import Link from "next/link";
import Image from "next/image";
import gardenLogo from "../../../public/images/garden_logo_orkney_font_fixed.png";

const TopLogo: React.FC = () => {
    return (
        <div className={styles.top}>
            <Link href="/" className={styles.topLogo}>
                <Image
                    src={gardenLogo}
                    alt="Garden Logo"
                    width={200}  // 実際の画像サイズに合わせて調整してください
                    height={100}  // 実際の画像サイズに合わせて調整してください
                />
            </Link>
        </div>
    )
}

export default TopLogo