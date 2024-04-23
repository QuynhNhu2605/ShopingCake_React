import React from "react";
import { Modal, Button } from "react-bootstrap";

const ProductEditModal = ({ product, showModal, handleClose }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Category: {product.category}</p>
        <p>Price: ${product.price}</p>
        <p>Year: {product.year}</p>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductEditModal;
