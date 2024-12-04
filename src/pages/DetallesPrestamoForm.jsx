import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const DetallesPrestamoForm = ({ prestamoId, show, onClose }) => {
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

          const response = await axios.get(`http://localhost:8081/api/admin/prestamos/${prestamoId}/detalles`,
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

  if (loading) {
    return <div>...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Préstamo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Agregamos la clase table-responsive */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Imagen</th> {/* Imagen como primera columna */}
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Categoría</th> {/* Reemplazamos Código de Activos Fijos por Categoría */}
                <th>Link DataSheet</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle, index) => (
                <tr key={index}>
                  <td>
                    {/* Mostrar la imagen del producto */}
                    {detalle.producto.imagen ? (
                      <img src={`data:image/jpeg;base64,${detalle.producto.imagen}`} alt={detalle.producto.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
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

export default DetallesPrestamoForm;

