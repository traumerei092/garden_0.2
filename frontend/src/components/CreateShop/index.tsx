import React, { useState, useEffect } from 'react'
import styles from "./style.module.scss";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";

interface CreateShopProps {
  show: boolean;
}

const CreateShop: React.FC<CreateShopProps> = ({ show }) => {

    const router = useRouter();
    const { data: session } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleNavigation = () => {
        if (session) {
            router.push('/shops/create');
        } else {
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={`${styles.outerCreateButton} ${show ? styles.show : styles.hide}`}>
                <Button
                    onClick={handleNavigation}
                    className={styles.innerCreateButton}
                >
                    <p>お店が見つからない</p>
                </Button>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} placement={"center"}>
                <ModalContent>
                    <ModalHeader>ログインが必要です</ModalHeader>
                    <ModalBody>
                        店舗情報の作成にはログインが必要です
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => router.push('/login')}>
                            ログイン
                        </Button>
                        <Button color="secondary" onClick={() => router.push('/signup')}>
                            サインアップ
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreateShop