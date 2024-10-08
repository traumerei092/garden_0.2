'use client'

import React from 'react'
import styles from "./style.module.scss";
import Link from "next/link";
import Image from "next/image";
import gardenLogo from "../../../public/images/garden_logo_orkney_font_fixed.png";
import HeaderMenu from "@/components/HeaderMenu";
import {useSession} from "next-auth/react";

interface HeaderProps {
  userEmail?: string | null;
}

const Header: React.FC<HeaderProps> = () => {
    const { data: session, status } = useSession();  // セッション状態を取得
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);

    const handleLogout = () => {
        // ログアウト処理
        setShowLogoutModal(true);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <Link href="/">
                    <Image
                        src={gardenLogo}
                        alt="Garden Logo"
                        width={120}  // 実際の画像サイズに合わせて調整してください
                        height={60}  // 実際の画像サイズに合わせて調整してください
                    />
                </Link>
            </div>
            <div className={styles.headerRight}>
                <HeaderMenu
                    isAuthenticated={status === "authenticated"}  // ログインしているかどうかを判定
                    onLogout={handleLogout}        // サインアップ処理
                />
            </div>
        </header>
    )
}

export default Header;