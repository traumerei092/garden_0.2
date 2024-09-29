import React from 'react';
import { Modal, ModalContent, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import styles from './style.module.scss';
import {invalidateSession} from "@/actions/user";
import {useRouter} from "next/navigation";
import {signOut} from "next-auth/react";

interface LogoutModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onOpenChange }) => {
　const router = useRouter();
　const { onClose } = useDisclosure();

  const handleLogout = async () => {
    // サーバーサイドでセッションを無効化
    const result = await invalidateSession();
    if (result.success) {
      // クライアントサイドでログアウトを完了し、リダイレクト
      await signOut({ redirect: false, callbackUrl: '/login'});
      onClose();
      router.push('/login');
    } else {
      console.error(result.error);
      // エラーメッセージをユーザーに表示する処理をここに追加
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: styles.modalBase,
        header: styles.modalHeader,
        body: styles.modalBody,
        footer: styles.modalFooter,
        closeButton: styles.modalCloseButton,
      }}
      placement={"center"}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className={styles.modalBodyContent}>
              <h3 className={styles.modalTitle}>ログアウトしますか？</h3>
            </ModalBody>
            <ModalFooter className={styles.modalFooterContent}>
              <Button color="default" onPress={handleLogout} className={styles.modalButton}>
                ログアウト
              </Button>
            　<Button color="primary" onPress={onClose} className={styles.modalButton}>
                もどる
            　</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LogoutModal;