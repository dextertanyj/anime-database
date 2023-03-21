import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

export interface ConfirmationModalProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (onSuccess: () => void) => void;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  colorScheme?: "teal" | "green" | "orange" | "red";
}

export const ConfirmationModal = ({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
  colorScheme = "red",
}: ConfirmationModalProps) => {
  const onConfirmClick = () => {
    onConfirm(onClose);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{description}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={4} variant="ghost" colorScheme="gray">
            {cancelText}
          </Button>
          <Button colorScheme={colorScheme} onClick={onConfirmClick} isLoading={isLoading}>
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const useConfirmationModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return { isOpen, onOpen, onClose };
};
