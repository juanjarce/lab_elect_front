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
          // Obtener el token del localStorage
          const token = localStorage.getItem('token'); 
          console.log(token);
    
          // Verificar si el token existe
          if (!token) {
            console.error('Token no encontrado');
            return;
          }

          const response = await axios.get(`https://labuq.catavento.co:10443/api/admin/prestamos/${prestamoId}/detalles`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Agregar el token al encabezado
              },
            }
          );
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
        // Obtener el token del localStorage
        const token = localStorage.getItem('token'); 
        console.log(token);
    
        // Verificar si el token existe
        if (!token) {
          console.error('Token no encontrado');
          return;
        }
        
        await axios.delete(`https://labuq.catavento.co:10443/api/admin/detalles/eliminar/${idDetallePrestamo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Agregar el token al encabezado
            },
          }
        );
        setDetalles((prevDetalles) => prevDetalles.filter((detalle) => detalle.id !== idDetallePrestamo));
      } catch (err) {
        alert(`Error al eliminar el detalle: ${err.response?.data?.message || err.message}`);
      }
    }
  };

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
