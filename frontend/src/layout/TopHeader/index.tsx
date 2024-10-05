'use client'

import React from 'react'
import styles from "./style.module.scss";
import HeaderMenu from "@/components/HeaderMenu";
import {useSession} from "next-auth/react";

interface HeaderProps {
  userEmail?: string | null;
}

const TopHeader: React.FC<HeaderProps> = () => {
    const { data: session, status } = useSession();  // セッション状態を取得
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);

    const handleLogout = () => {
        // ログアウト処理
        setShowLogoutModal(true);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>

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

export default TopHeader;