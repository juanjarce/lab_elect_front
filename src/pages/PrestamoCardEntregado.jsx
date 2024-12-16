import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa'; // Icono para entregar
import { CSSTransition } from 'react-transition-group'; // Importa CSSTransition
import './css/PrestamoCardEntregado.css'; // Importa el archivo CSS

const PrestamoCardEntregado = ({ prestamo, onVerDetalles, onEntregar }) => {
  const [inProp, setInProp] = useState(false); // Control de la animación de entrada
  const [loading, setLoading] = useState(false); // Control de carga para el spinner

  useEffect(() => {
    setInProp(true); // Activar la animación al montar el componente
  }, []);

  const handleVerDetalles = () => {
    onVerDetalles(prestamo.id);
  };

  const handleEntregarPrestamo = async () => {
    const confirmEntrega = window.confirm(`¿Está seguro de que desea marcar el préstamo como ENTREGADO #${prestamo.id}?`);
    if (confirmEntrega) {
      setLoading(true); // Mostrar spinner
      try {
        await onEntregar(prestamo.id); // Llamada a la función de entrega
      } catch (error) {
        console.error('Error al entregar el préstamo:', error);
      } finally {
        setLoading(false); // Ocultar spinner después de la entrega
      }
    }
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-4">
      <CSSTransition
        in={inProp} // Usamos el estado inProp para controlar la animación
        timeout={500} // Duración de la animación
        classNames="card-transition" // Nombre base de las clases de animación
        unmountOnExit
      >
        <Card className="prestamo-card mb-3 shadow-sm" onClick={handleVerDetalles} style={{ cursor: 'pointer' }}>
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <Card.Title className="mb-1">Préstamo #{prestamo.id}</Card.Title>
              <Card.Subtitle className="text-muted">Estudiante: {prestamo.nombreEstudiante}</Card.Subtitle>
              <Card.Text className="mt-2">
                Fecha de Préstamo: {new Date(prestamo.fechaPrestamo).toLocaleDateString()} <br />
                Estado: <span className="badge bg-primary text-white">{prestamo.estado}</span>
              </Card.Text>
            </div>

            <div className="button-container" style={{ position: 'relative' }}>
              <Button
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation(); // Evitar que se active el modal al hacer clic en el botón
                  handleEntregarPrestamo();
                }}
                disabled={loading} // Deshabilitar botón mientras se está entregando
              >
                <FaCheckCircle className="me-2" />
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  'Entregar'
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </CSSTransition>
    </div>
  );
};

export default PrestamoCardEntregado;
