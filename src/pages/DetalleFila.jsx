import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaTrashAlt, FaSpinner } from 'react-icons/fa';

const DetalleFila = ({ detalle, onEliminar }) => {
  const [loadingEliminar, setLoadingEliminar] = useState(false); // Estado de carga

  // Función para manejar la eliminación
  const handleEliminar = () => {
    setLoadingEliminar(true); // Activamos el estado de carga
    onEliminar(detalle.id) // Llamamos a la función onEliminar
      .finally(() => setLoadingEliminar(false)); // Desactivamos el estado de carga después de la eliminación
  };

  return (
    <tr>
      <td>{detalle.id}</td>
      <td>{new Date(detalle.prestamo.fechaSolicitud).toLocaleDateString()}</td>
      <td>
        <img
          src={`data:image/png;base64,${detalle.producto.imagen}`}
          alt={detalle.producto.nombre}
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      </td>
      <td>{detalle.producto.nombre}</td> {/* Nombre del producto */}
      <td>{detalle.cantidad}</td>
      <td>{detalle.producto.ubicacion}</td> {/* Ubicación */}
      <td>
        <Button
          variant="danger"
          size="sm"
          onClick={handleEliminar}
          disabled={loadingEliminar} // Desactivamos el botón mientras se está eliminando
        >
          {loadingEliminar ? <FaSpinner className="fa-spin" /> : <FaTrashAlt />} {/* Muestra el spinner mientras se carga */}
        </Button>
      </td>
    </tr>
  );
};

export default DetalleFila;

