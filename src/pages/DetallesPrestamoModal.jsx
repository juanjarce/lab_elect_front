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
        setLoading(true); // Establecer carga en true al inicio de la solicitud
        try {
          // Obtener el token del localStorage
          const token = localStorage.getItem('token'); 
          console.log(token);
          
          // Verificar si el token existe
          if (!token) {
            setError('Token no encontrado');
            return;
          }
  
          const response = await axios.get(`https://labuq.catavento.co:10443/api/admin/prestamos/${prestamoId}/detalles`, {
            headers: {
              Authorization: `Bearer ${token}`, // Agregar el token al encabezado
            },
          });
  
          if (response.data.status === 'Exito') {
            setDetalles(response.data.data || []); // Asignar detalles si la respuesta es exitosa
          } else {
            setError('No se pudieron obtener los detalles.');
          }
        } catch (err) {
          setDetalles([]);
          const token = localStorage.getItem('token'); // Obtener el token desde el localStorage
  
          if (!token) {
            setError('Token no encontrado.');
            return;
          }
        
          try {
            // Realizar la solicitud DELETE
            const response = await axios.delete(`https://labuq.catavento.co:10443/api/admin/prestamos/eliminar/${prestamoId}`, {
              headers: {
                Authorization: `Bearer ${token}`, // Incluir el token en los headers
              },
            });
        
          } catch (error) {
            
          }
        } finally {
          setLoading(false); // Asegurarnos de que se apaga la carga, independientemente del resultado
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

  const handleCloseModal = () => {
    // Limpiar los detalles al cerrar el modal
    setDetalles([]);
    onClose(); // Llamar a la función que cierra el modal
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
        <Button variant="secondary" onClick={handleCloseModal}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetallesPrestamoModal;
