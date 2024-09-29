import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import rulesContent from './rulesContent';
import styles from './style.module.scss';

interface RulesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onOpenChange }) => {
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
            <ModalHeader className="flex flex-col gap-1">利用規約及びプライバシーポリシー</ModalHeader>
            <ModalBody>
              {rulesContent.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                閉じる
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RulesModal;