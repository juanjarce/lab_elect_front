import React from 'react';
import { Table } from 'react-bootstrap';
import DetalleFila from './DetalleFila'; // Importamos el componente de fila

const TablaDetalles = ({ detalles, onEliminar }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID Detalle</th>
          <th>Fecha Solicitud</th>
          <th>Imagen</th> {/* Nueva columna para la imagen */}
          <th>Producto</th> {/* Nueva columna para el nombre del producto */}
          <th>Cantidad</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {detalles.map((detalle) => (
          <DetalleFila
            key={detalle.id}
            detalle={detalle}
            onEliminar={onEliminar}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default TablaDetalles;

