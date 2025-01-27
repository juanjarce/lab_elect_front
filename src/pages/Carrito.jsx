import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Alert } from 'react-bootstrap';
import DetalleFila from './DetalleFila'; 
import { CSSTransition, TransitionGroup } from 'react-transition-group'; 
import './css/Carrito.css'; 

const Carrito = () => {
  const { id } = useParams(); 
  const [detalles, setDetalles] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(''); 

  // Obtener los detalles de préstamo del estudiante
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    setLoading(true);
    axios
      .get(`http://72.167.51.48:8082/api/estudiantes/detalles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const detallesData = response.data.data || [];
        setDetalles(detallesData);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error al cargar los detalles del préstamo');
        setLoading(false);
      });
  }, [id]);

  // Eliminar detalle de préstamo
  const handleEliminar = (idDetalle) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    axios
      .delete(`http://72.167.51.48:8082/api/estudiantes/detalles/eliminar/${idDetalle}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setDetalles((prevDetalles) =>
          prevDetalles.filter((detalle) => detalle.id !== idDetalle)
        );
      })
      .catch(() => {
        setError('Error al eliminar el detalle de préstamo');
      });
  };

  if (loading) return null;

  return (
    <div>
      <h2>Carrito de Préstamo</h2>

      {detalles.length === 0 ? (
        <Alert variant="info">El carrito está vacío.</Alert>
      ) : (
        <TransitionGroup component="div">
          <CSSTransition in={true} timeout={500} classNames="fade" unmountOnExit>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID Detalle</th>
                  <th>Fecha Solicitud</th>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Ubicación</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle) => (
                  <CSSTransition
                    key={detalle.id}
                    timeout={500}
                    classNames="fade"
                  >
                    <DetalleFila
                      detalle={detalle}
                      onEliminar={handleEliminar}
                    />
                  </CSSTransition>
                ))}
              </tbody>
            </Table>
          </CSSTransition>
        </TransitionGroup>
      )}
    </div>
  );
};

export default Carrito;
