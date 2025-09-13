import React from "react";
import { Button, Modal } from "../ui/Modal";

interface ConfirmModalProps {
  isShow: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
}

function ConfirmModal({
  isShow = false,
  title = "",
  description = "",
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal show={isShow} onHide={onClose}>
      <Modal.Header closeButton onClose={onClose}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{description}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Yes, I'm sure
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
