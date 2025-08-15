import { Table } from "react-bootstrap";
import DetalleFila from "./DetalleFila";

const TablaDetalles = ({ detalles, onEliminar }) => {
  return (
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
