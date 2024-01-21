import { Button, Modal } from 'react-bootstrap';
import React, { useState } from 'react';

const ConfirmStartModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleSubmit = () => {
    handleClose()
    //@todo: start selected game mode game
  };
  const handleShow = () => setShowModal(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch Game
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Launch {'gameName'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmStartModal