import React from 'react';
import { User } from '@/types/user';
import { Card, CardHeader, CardBody, Image, Divider } from "@nextui-org/react";
import { CalendarDays, Heart, Star } from 'lucide-react';
import styles from './style.module.scss';

interface ProfileCardProps {
  user: User;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <Image
          alt={user.name}
          className={styles.avatar}
          src={user.avatar}
          width={100}
          height={100}
        />
        <div className={styles.headerContent}>
          <h2 className={styles.name}>{user.name}</h2>
          <p className={styles.email}>{user.email}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className={styles.cardBody}>
        <p className={styles.bio}>{user.bio}</p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <Heart size={20} />
            <span>{user.favoriteShops} お気に入り</span>
          </div>
          <div className={styles.stat}>
            <Star size={20} />
            <span>{user.reviews} レビュー</span>
          </div>
          <div className={styles.stat}>
            <CalendarDays size={20} />
            <span>登録日: {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProfileCard;