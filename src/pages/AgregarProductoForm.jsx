import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const AgregarProductoForm = ({ show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cantidad: 0,
    disponibleParaPrestamo: true,
    imagen: null,
    categoria: 'EQUIPOS',
    codigoActivosFijos: '',
    linkDataSheet: '',
  });

  const [error, setError] = useState(''); // Estado para manejar los errores de validación

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verifica si el archivo excede los 64 KB (64 * 1024 bytes)
      if (file.size > 64 * 1024) {
        setError("La imagen no debe exceder los 64 KB.");
        setFormData({ ...formData, imagen: null }); // Limpiar el valor de la imagen
      } else {
        setError(''); // Limpiar el mensaje de error si la imagen es válida
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, imagen: reader.result.split(',')[1] });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) {
      return; // Si hay un error, no se envía el formulario
    }
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleInputChange}
              min="0"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
            >
              <option value="EQUIPOS">EQUIPOS</option>
              <option value="COMPONENTES">COMPONENTES</option>
              <option value="TARJETAS">TARJETAS</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Imagen</Form.Label>
            <Form.Control type="file" onChange={handleImageUpload} />
            {error && <Alert variant="danger" className="mt-2">{error}</Alert>} {/* Muestra el error si existe */}
          </Form.Group>
          <Form.Group>
            <Form.Label>Código de Activos Fijos</Form.Label>
            <Form.Control
              type="text"
              name="codigoActivosFijos"
              value={formData.codigoActivosFijos}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Link Datasheet</Form.Label>
            <Form.Control
              type="text"
              name="linkDataSheet"
              value={formData.linkDataSheet}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3" disabled={!!error}>
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgregarProductoForm;


