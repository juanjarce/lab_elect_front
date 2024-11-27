import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ProductoDetalleModal = ({ producto, onClose }) => {
  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>ID Producto</Form.Label>
            <Form.Control type="text" value={producto.id} disabled />
          </Form.Group>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" value={producto.nombre} disabled />
          </Form.Group>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={3} value={producto.descripcion} disabled />
          </Form.Group>
          <Form.Group>
            <Form.Label>Categoría</Form.Label>
            <Form.Control type="text" value={producto.categoria} disabled />
          </Form.Group>
          <Form.Group>
            <Form.Label>Total Existencias</Form.Label>
            <Form.Control type="text" value={producto.cantidad} disabled />
          </Form.Group>
          <Form.Group>
          <Form.Label>Link DataSheet</Form.Label>
          <a href={producto.linkDataSheet} target="_blank" rel="noopener noreferrer">
           {producto.linkDataSheet}
          </a>
        </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductoDetalleModal;
