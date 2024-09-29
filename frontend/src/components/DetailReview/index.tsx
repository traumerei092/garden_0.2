import React, { useState, useEffect } from 'react';
import { Image, Card, Avatar } from "@nextui-org/react";
import { Heart } from 'lucide-react';
import styles from './style.module.scss';
import { getReviews } from '@/actions/reviews';
import DividerLine from "@/components/DividerLine";

interface Review {
    id: number;
    user: {
        name: string;
        avatar: string;
    };
    title: string;
    content: string;
    likes: number;
    created_at: string;
    photos: { id: number; image: string }[];
}

interface DetailReviewProps {
    shopId: number;
}

const MAX_CONTENT_LENGTH = 100;

const DetailReview: React.FC<DetailReviewProps> = ({ shopId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const fetchedReviews = await getReviews(shopId);
                setReviews(fetchedReviews);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
                // エラーメッセージをユーザーに表示するなどの処理を追加
            }
        };
        fetchReviews();
    }, [shopId]);

    const truncateContent = (content: string) => {
        if (content.length <= MAX_CONTENT_LENGTH) return content;
        return content.slice(0, MAX_CONTENT_LENGTH) + '...';
    };

    return (
        <div className={styles.reviewContainer}>
            {reviews.map((review) => (
                <Card key={review.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                        <div className={styles.reviewHeaderLeft}>
                            <Avatar
                                src={review.user.avatar || "/default-avatar.png"}
                                name={review.user}
                                className={styles.avatar}
                            />
                            <span className={styles.userName}>{review.user}</span>
                        </div>
                        <div className={styles.reviewHeaderRight}>
                            <Heart className={styles.likeIcon} />
                            <span className={styles.likeCount}>{review.likes}</span>
                        </div>
                    </div>
                    <DividerLine/>
                    <div className={styles.reviewBody}>
                        <h3 className={styles.reviewTitle}>{review.title}</h3>
                        <p className={styles.reviewContent}>{review.content}</p>
                    </div>
                    <div className={styles.photoContainer}>
                        {review.photos.map((photo) => (
                            <Image
                                key={photo.id}
                                src={photo.image}
                                alt="Review photo"
                                className={styles.reviewPhoto}
                            />
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default DetailReview;