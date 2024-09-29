'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import ShopCreateForm from '@/components/ShopCreateForm';
import styles from './style.module.scss';

const CreateShopPage: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  console.log('Session:', session);
  console.log('Status:', status);

  if (!session) {
    return <div>Please sign in to create a shop</div>;
  }

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>Barを登録する</h1>
      <ShopCreateForm />
    </div>
  );
};

export default CreateShopPage;