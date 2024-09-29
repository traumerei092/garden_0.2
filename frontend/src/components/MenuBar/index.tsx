'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import styles from './style.module.scss';
import { Navbar, NavbarItem, Link } from "@nextui-org/react";
import Image from "next/image";
import {cn} from "@nextui-org/react";

// アイコンのインポート
import homeLogoActive from "../../../public/images/home_active.png";
import homeLogo from "../../../public/images/home.png";
import eventLogoActive from "../../../public/images/event_active.png";
import eventLogo from "../../../public/images/event.png";
import checkinLogoActive from "../../../public/images/checkin_active.png";
import checkinLogo from "../../../public/images/checkin.png";
import shopdataLogoActive from "../../../public/images/shopdata_active.png";
import shopdataLogo from "../../../public/images/shopdata.png";
import talkLogoActive from "../../../public/images/talk_active.png";
import talkLogo from "../../../public/images/talk.png";
import friendsLogoActive from "../../../public/images/friends_active.png";
import friendsLogo from "../../../public/images/friends.png";

const MenuBar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <Navbar className={styles.menuBar}>
      <NavbarItem className={styles.menuBarItem}>
        <Link href="/">
          <Image
            src={isActive('/') ? homeLogoActive : homeLogo}
            alt="Home"
            width={25}
            height={25}
          />
        </Link>
      </NavbarItem>
      <NavbarItem className={styles.menuBarItem}>
        <Link href="/shops/create">
          <Image
            src={isActive('/event') ? eventLogoActive : eventLogo}
            alt="Event"
            width={25}
            height={25}
          />
        </Link>
      </NavbarItem>
      <NavbarItem className={styles.menuBarItem}>
        <Link href="/checkin">
          <Image
            src={isActive('/checkin') ? checkinLogoActive : checkinLogo}
            alt="CheckIn"
            width={25}
            height={25}
          />
        </Link>
      </NavbarItem>
      <NavbarItem className={styles.menuBarItem}>
        <Link href="/shopdata">
          <Image
            src={isActive('/shopdata') ? shopdataLogoActive : shopdataLogo}
            alt="ShopData"
            width={25}
            height={25}
          />
        </Link>
      </NavbarItem>
      <NavbarItem className={styles.menuBarItem}>
        <Link href="/talk">
          <Image
            src={isActive('/talk') ? talkLogoActive : talkLogo}
            alt="Talk"
            width={25}
            height={25}
          />
        </Link>
      </NavbarItem>
    </Navbar>
  );
};

export default MenuBar;