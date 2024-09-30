import React, { useState } from 'react';
import {Modal, Button, Input, Textarea, ModalHeader, ModalBody, ModalFooter, ModalContent} from "@nextui-org/react";
import { Upload } from 'lucide-react';
import styles from './style.module.scss';
import { createReview } from '@/actions/reviews';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    shopId: number;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, shopId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            setError('タイトルと本文は必須です。');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await createReview(shopId, { title, content, images });
            onClose();
            // TODO: 成功メッセージを表示するか、口コミリストを更新する
        } catch (err) {
            setError('口コミの投稿に失敗しました。再度お試しください。');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className={styles.reviewModal}
            placement={"center"}
        >
            <ModalContent>
                <ModalHeader>
                    <h3 className={styles.modalTitle}>魅力を伝える</h3>
                </ModalHeader>
                <ModalBody>
                    <Input
                        label="タイトル"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.input}
                    />
                    <Textarea
                        label="本文"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={styles.textarea}
                    />
                    <div className={styles.imageUpload}>
                        <label htmlFor="image-upload" className={styles.uploadLabel}>
                            <Upload />
                            画像をアップロード
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={styles.fileInput}
                        />
                    </div>
                    {images.length > 0 && (
                        <p>{images.length} 枚の画像が選択されました</p>
                    )}
                    {error && <p className={styles.error}>{error}</p>}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={onClose}>
                        キャンセル
                    </Button>
                    <Button color={"primary"} onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? '投稿中...' : '投稿する'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ReviewModal;