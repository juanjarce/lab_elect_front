import React from 'react';
import { Button } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';

const DetalleFila = ({ detalle, onEliminar }) => {
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
      <td>{detalle.producto.ubicacion}</td> {/* Nueva celda para la ubicación */}
      <td>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onEliminar(detalle.id)}
        >
          <FaTrashAlt />
        </Button>
      </td>
    </tr>
  );
};

export default DetalleFila;


