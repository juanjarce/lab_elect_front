import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';

const DetallesPrestamoFormSinEntrega = ({ prestamoId, show, onClose }) => {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (prestamoId) {
      const fetchDetalles = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('token'); 

          if (!token) {
            console.error('Token no encontrado');
            return;
          }    

          const response = await axios.get(`http://localhost:8081/api/admin/prestamos/${prestamoId}/detalles`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Préstamo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Tabla de detalles */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Categoría</th>
                <th>Link DataSheet</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle, index) => (
                <tr key={index}>
                  <td>
                    {detalle.producto.imagen ? (
                      <img
                        src={`data:image/jpeg;base64,${detalle.producto.imagen}`}
                        alt={detalle.producto.nombre}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    ) : (
                      'No disponible'
                    )}
                  </td>
                  <td>{detalle.producto.nombre}</td>
                  <td>{detalle.cantidad}</td>
                  <td>{detalle.producto.categoria || 'No disponible'}</td>
                  <td>
                    {detalle.producto.linkDataSheet ? (
                      <a href={detalle.producto.linkDataSheet} target="_blank" rel="noopener noreferrer">
                        Ver DataSheet
                      </a>
                    ) : (
                      'No disponible'
                    )}
                  </td>
                  <td>{detalle.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetallesPrestamoFormSinEntrega;
