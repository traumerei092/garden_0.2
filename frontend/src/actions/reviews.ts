import axios from 'axios';
import {getSession} from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ReviewData {
    title: string;
    content: string;
    images?: File[];
}

export const createReview = async (shopId: number, reviewData: ReviewData) => {
    const session = await getSession();
    if (!session) {
        throw new Error('認証されていません。ログインしてください。');
    }

    const formData = new FormData();
    formData.append('shop', shopId.toString());
    formData.append('title', reviewData.title);
    formData.append('content', reviewData.content);

    if (reviewData.images) {
        reviewData.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });
    }

    try {
        const response = await axios.post(`${API_URL}/api/shops/reviews/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${session.accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
};

export const getReviews = async (shopId: number) => {
    try {
        const session = await getSession();
        if (!session) {
            throw new Error('認証されていません。ログインしてください。');
        }

        const response = await axios.get(`${API_URL}/api/shops/reviews/?shop_id=${shopId}`, {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
};