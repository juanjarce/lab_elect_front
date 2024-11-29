import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import TablaDetalles from './TablaDetalles'; // Componente reutilizable

const DetallesPrestamoModal = ({ prestamoId, show, onClose }) => {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (prestamoId) {
      const fetchDetalles = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8081/api/admin/prestamos/${prestamoId}/detalles`);
          if (response.data.status === 'Exito') {
            setDetalles(response.data.data || []);
          } else {
            setError('No se pudieron obtener los detalles.');
          }
        } catch (err) {
          setError(`Error al cargar los detalles: ${err.response?.data?.message || err.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchDetalles();
    }
  }, [prestamoId]);

  const handleEliminarDetalle = async (idDetallePrestamo) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el detalle con ID ${idDetallePrestamo}?`)) {
      try {
        await axios.delete(`http://localhost:8081/api/admin/detalles/eliminar/${idDetallePrestamo}`);
        setDetalles((prevDetalles) => prevDetalles.filter((detalle) => detalle.id !== idDetallePrestamo));
      } catch (err) {
        alert(`Error al eliminar el detalle: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Préstamo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TablaDetalles detalles={detalles} onEliminar={handleEliminarDetalle} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetallesPrestamoModal;
