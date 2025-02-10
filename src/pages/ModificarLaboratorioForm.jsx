import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const ModificarLaboratorioForm = ({ show, onClose, onSave, laboratorio }) => {
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    capacidad: '',
    imagen: null
  });

  const [imageError, setImageError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (laboratorio) {
      setFormData({
        id: laboratorio.id,
        nombre: laboratorio.nombre,
        descripcion: laboratorio.descripcion,
        capacidad: laboratorio.capacidad,
        imagen: null 
      });
    }
  }, [laboratorio]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (imageError) {
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        capacidad: formData.capacidad,
        imagen: formData.imagen || null 
      };

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        setIsLoading(false);
        return;
      }

      await axios.put(`http://localhost:8081/api/admin/laboratorios/actualizar/${formData.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      onSave(formDataToSend);
      onClose();
    } catch (error) {
      console.error('Error al modificar el laboratorio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeInKB = file.size / 1024;
      if (fileSizeInKB > 64) {
        setImageError('La imagen no debe superar los 64KB.');
      } else {
        setImageError('');
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, imagen: reader.result.split(',')[1] });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Laboratorio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="id">
            <Form.Label>ID</Form.Label>
            <Form.Control type="text" value={formData.id} disabled />
          </Form.Group>

          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="descripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="capacidad">
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="number"
              value={formData.capacidad}
              onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="imagen">
            <Form.Label>Imagen (Base64)</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
            {imageError && <Alert variant="danger">{imageError}</Alert>}
            <Form.Text className="text-muted">
              Si no desea cambiar la imagen, puede dejar este campo vacío.
            </Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isLoading || imageError} className="mt-3">
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                {' Guardando...'}
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificarLaboratorioForm;