'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import MenuBar from '@/components/MenuBar/index';

const MenuBarController: React.FC = () => {
  const pathname = usePathname();
  const isAuthPage = ['/login', '/signup'].includes(pathname);

  if (isAuthPage) {
    return null;
  }

  return <MenuBar />;
};

export default MenuBarController;