import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import DetalleFila from './DetalleFila'; // Importamos el componente de fila

const Carrito = () => {
  const { id } = useParams(); // Obtenemos el id del estudiante de la URL
  const [detalles, setDetalles] = useState([]); // Detalles de los productos en el carrito
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(''); // Mensaje de error

  // Obtener los detalles de préstamo del estudiante
  useEffect(() => {
    setLoading(true); // Reiniciar el estado de carga cada vez que se haga una nueva solicitud
    axios
      .get(`http://localhost:8081/api/estudiantes/detalles/${id}`)
      .then((response) => {
        // Verifica que la respuesta tenga datos antes de actualizarlos
        const detallesData = response.data.data || []; // Asegúrate de que sea un arreglo vacío si no hay datos
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
    axios
      .delete(`http://localhost:8081/api/estudiantes/detalles/eliminar/${idDetalle}`)
      .then(() => {
        setDetalles((prevDetalles) =>
          prevDetalles.filter((detalle) => detalle.id !== idDetalle)
        );
      })
      .catch(() => {
        setError('Error al eliminar el detalle de préstamo');
      });
  };

  if (loading) return <p>Cargando...</p>; // Muestra el mensaje de carga

  return (
    <div>
      <h2>Carrito de Préstamo</h2>

      {/* Verifica si el carrito está vacío */}
      {detalles.length === 0 ? (
        <Alert variant="info">El carrito está vacío.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID Detalle</th>
              <th>Fecha Solicitud</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((detalle) => (
              <DetalleFila
                key={detalle.id}
                detalle={detalle}
                onEliminar={handleEliminar}
              />
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Carrito;


