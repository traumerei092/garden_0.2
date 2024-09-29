'use client'

import React from 'react'
import styles from "./style.module.scss";
import Link from "next/link";
import Image from "next/image";
import gardenLogo from "../../../public/images/garden_logo_orkney_font_fixed.png";
import {Navbar, NavbarContent, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import LogoutModal from "@/components/LogoutModal";

interface HeaderProps {
  userEmail?: string | null;
}

const Header: React.FC<HeaderProps> = ({ userEmail }) => {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);

    const menuItems = [
        { label: "プロフィール", link: "/profile" },
        { label: "マイショップ", link: "/myshop" },
        { label: "友だち", link: "/friends" },
        { label: "アクティビティ", link: "/activity" },
        { label: "通知グループ", link: "/notifications" },
        { label: "ブロックリスト", link: "/blocklist" },
        { label: "設定", link: "/settings" },
        { label: "ヘルプ", link: "/help" },
        { label: "Log Out", link: null },  // Log Outはモーダルで処理するためリンクなし
    ];

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
                <Navbar
                  onMenuOpenChange={setIsMenuOpen}
                  className={styles.navbar}
                  style={{
                    backgroundColor: 'transparent',
                    minHeight: 'auto',
                    height: '100%'
                  }}
                >
                  <NavbarContent justify="end">
                    <NavbarMenuToggle
                      aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                      className={styles.navbarMenuToggle}
                    />
                  </NavbarContent>
                  <NavbarMenu
                      className={styles.navbarMenu}
                      style={{
                        backgroundColor: 'transparent',
                      }}
                  >
                    {menuItems.map((item, index) => (
                      <NavbarMenuItem key={`${item.label}-${index}`} className={styles.navbarMenuItemWrapper}>
                        {item.label === "Log Out" ? (
                          <button
                              onClick={() => setShowLogoutModal(true)}
                              className={`${styles.navbarMenuItem} ${styles.danger}`}
                          >
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            href={item.link || "#"}
                            className={styles.navbarMenuItem}
                          >
                            {item.label}
                          </Link>
                        )}
                      </NavbarMenuItem>
                    ))}
                  </NavbarMenu>
                </Navbar>
            </div>
            <LogoutModal isOpen={showLogoutModal} onOpenChange={setShowLogoutModal} />
        </header>
    )
}

export default Header