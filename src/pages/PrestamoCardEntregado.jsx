import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa'; // Icono para entregar

const PrestamoCardEntregado = ({ prestamo, onVerDetalles, onEntregar }) => {
  const handleVerDetalles = () => {
    onVerDetalles(prestamo.id);
  };

  const handleEntregarPrestamo = () => {
    const confirmEntrega = window.confirm(`¿Está seguro de que desea marcar el préstamo como ENTREGADO #${prestamo.id}?`);
    if (confirmEntrega) {
      onEntregar(prestamo.id);
    }
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-4"> {/* Asegura que el card se mantenga con un tamaño similar al de los otros */}
      <Card className="mb-3 shadow-sm" onClick={handleVerDetalles} style={{ cursor: 'pointer' }}>
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Title className="mb-1">Préstamo #{prestamo.id}</Card.Title>
            <Card.Subtitle className="text-muted">Estudiante: {prestamo.nombreEstudiante || 'No disponible'}</Card.Subtitle>
            <Card.Text className="mt-2">
              Fecha de Préstamo: {new Date(prestamo.fechaPrestamo).toLocaleDateString()} <br />
              Estado: <span className="badge bg-primary text-white">{prestamo.estado}</span>
            </Card.Text>
          </div>

          <Button
            variant="primary"
            onClick={(e) => {
              e.stopPropagation(); // Evitar que se active el modal al hacer clic en el botón
              handleEntregarPrestamo();
            }}
          >
            <FaCheckCircle className="me-2" />
            Entregar
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PrestamoCardEntregado;

