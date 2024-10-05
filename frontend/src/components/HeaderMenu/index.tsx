'use client'

import React from 'react'
import styles from "./style.module.scss";
import Link from "next/link";
import {Navbar, NavbarContent, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button} from "@nextui-org/react";
import LogoutModal from "@/components/LogoutModal";
import DividerLine from "@/components/DividerLine";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";

interface HeaderMenuProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ isAuthenticated, onLogout }) => {
    const router = useRouter();  // ルーティング用のフック

      const [isMenuOpen, setIsMenuOpen] = React.useState(false);
      const [showLogoutModal, setShowLogoutModal] = React.useState(false);

      const menuItems = [
        { label: "プロフィール", link: "/profile" },
        { label: "行きつけ", link: "/" },
        { label: "気になる", link: "/" },
        { label: "閲覧履歴", link: "/" },
        { label: "Log Out", link: null },  // Log Outはモーダルで処理するためリンクなし
      ];

      const handleLogin = () => {
        router.push('/login');  // "/login" に遷移
      };

      const handleSignUp = () => {
          router.push('/signup');  // "/signup" に遷移
      };

      return (
          <>
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
            {isAuthenticated ? (
              // ログインしている場合のメニュー
              menuItems.map((item, index) => (
                <NavbarMenuItem key={`${item.label}-${index}`} className={styles.navbarMenuItemWrapper}>
                  {item.label === "Log Out" ? (
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className={`${styles.navbarMenuItem} ${styles.danger}`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link href={item.link || "#"} className={styles.navbarMenuItem}>
                      {item.label}
                    </Link>
                  )}
                </NavbarMenuItem>
              ))
            ) : (
              // ログインしていない場合のメニュー
              <>
                <NavbarMenuItem className={styles.navbarMenuItemWrapper}>
                  <div className={styles.navbarAuth}>
                    <Button
                      onClick={handleLogin}
                      className={styles.toLogin}
                    >
                      Log In
                    </Button>
                    <Button
                      onClick={handleSignUp}
                      className={styles.toSignup}
                    >
                      Sign Up
                    </Button>
                  </div>

                </NavbarMenuItem>
                <DividerLine/>
                <NavbarMenuItem className={styles.navbarMenuItemWrapper}>
                  <Link href="/" className={styles.navbarMenuItem}>
                    使い方ガイド
                  </Link>
                </NavbarMenuItem>
              </>
            )}
          </NavbarMenu>

        </Navbar>
            <LogoutModal isOpen={showLogoutModal} onOpenChange={setShowLogoutModal} />
          </>
      );
}

export default HeaderMenu;
