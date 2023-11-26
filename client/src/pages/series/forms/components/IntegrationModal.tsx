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

export interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationModal = ({ isOpen, onClose }: IntegrationModalProps) => {
  const onConfirmClick = () => {
    onClose;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{""}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{""}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={4} variant="ghost" colorScheme="gray">
            Cancel
          </Button>
          <Button onClick={onConfirmClick}>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const useIntegrationModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return { isOpen, onOpen, onClose };
};
