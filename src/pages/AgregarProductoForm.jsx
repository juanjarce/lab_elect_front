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
    codigoActivosFijos: '', // Opcional
    linkDataSheet: '', // Opcional
    ubicacion: 'LABORATORIO_ELECTRÓNICA',
    responsable: '', // Campo obligatorio
  });

  const [error, setError] = useState(''); // Estado para manejar los errores de validación

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 64 * 1024) {
        setError("La imagen no debe exceder los 64 KB.");
        setFormData({ ...formData, imagen: null });
      } else {
        setError(""); // Limpiar error si la imagen es válida
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, imagen: reader.result.split(",")[1] });
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

    // Validar que los campos obligatorios no estén vacíos
    if (!formData.imagen) {
      setError('Debe subir una imagen del producto.');
      return;
    }

    // Limpiar errores y enviar los datos
    setError('');
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
              required
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
              required
            >
              <option value="EQUIPOS">EQUIPOS</option>
              <option value="COMPONENTES">COMPONENTES</option>
              <option value="TARJETAS">TARJETAS</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Imagen</Form.Label>
            <Form.Control type="file" onChange={handleImageUpload} />
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
          <Form.Group>
            <Form.Label>Ubicación del Laboratorio</Form.Label>
            <Form.Select
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleInputChange}
              required
            >
              <option value="LABORATORIO_ELECTRÓNICA">Laboratorio Electrónica</option>
              <option value="LABORATORIO_PROTOTIPADO">Laboratorio Prototipado</option>
              <option value="LABORATORIO_TELEMÁTICA">Laboratorio Telemática</option>
              <option value="BODEGA">Bodega</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Responsable</Form.Label>
            <Form.Control
              type="text"
              name="responsable"
              value={formData.responsable}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Guardar
          </Button>
          {error && <Alert variant="danger" className="mt-2">{error}</Alert>} {/* Muestra el error si existe */}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgregarProductoForm;




