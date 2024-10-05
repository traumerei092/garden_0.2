'use client'

import React, { useEffect, useState } from 'react';
import { getUserProfile } from '@/actions/user';
import styles from "./style.module.scss";
import ProfileCard from '@/components/ProfileCard';
import { User } from '@/types/user';
import {Button} from "@nextui-org/react";
import {router} from "next/client";
import {useRouter} from "next/navigation";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await getUserProfile();
      setUser(profile);
    };
    fetchUserProfile();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <ProfileCard user={user} />
      <Button
        onClick={() => router.push('/')}
        className={styles.backButton}
      >
        トップページに戻る
      </Button>
    </div>
  );
};

export default ProfilePage;