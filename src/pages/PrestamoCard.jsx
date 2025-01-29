import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa'; // Icono para aprobar
import { CSSTransition } from 'react-transition-group'; // Importa CSSTransition
import './css/PrestamoCard.css'; // Importa el archivo CSS

const PrestamoCard = ({ prestamo, onVerDetalles, onAprobar }) => {
  const [estudianteNombre, setEstudianteNombre] = useState('');
  const [estudianteCedula, setEstudianteCedula] = useState('');
  const [inProp, setInProp] = useState(false); // Controlar la animación de aparición
  const [loading, setLoading] = useState(false); // Estado de carga para el botón de aprobar

  useEffect(() => {
    const fetchEstudianteName = async () => {
      try {
        const response = await axios.get(`https://labuq.catavento.co:10443/api/admin/estudiante/info?id=${prestamo.idEstudiante}`);
        setEstudianteNombre(response.data.data.nombre);
        setEstudianteCedula(response.data.data.cedula);
      } catch (err) {
        setEstudianteNombre('Nombre no disponible');
        setEstudianteCedula('Cedula no disponible');
      }
    };
    fetchEstudianteName();
    setInProp(true); // Activar animación al montar el componente
  }, [prestamo.idEstudiante]);

  const handleAprobar = async () => {
    setLoading(true); // Iniciar carga al aprobar
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        return;
      }

      const response = await axios.put(
        `https://labuq.catavento.co:10443/api/admin/prestamos/aprobar/${prestamo.id}/${prestamo.idEstudiante}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 'Exito') {
        alert('Préstamo aprobado exitosamente.');
        onAprobar();
      } else {
        alert('Error al aprobar el préstamo.');
      }
    } catch (error) {
      alert('Error al aprobar el préstamo.');
    } finally {
      setLoading(false); // Detener carga una vez completado
    }
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-4">
      {/* CSSTransition para la animación de entrada */}
      <CSSTransition in={inProp} timeout={500} classNames="card-transition" unmountOnExit>
        <Card className="prestamo-card mb-3 shadow-sm" onClick={() => onVerDetalles(prestamo.id)} style={{ cursor: 'pointer' }}>
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <Card.Title className="mb-1">Préstamo #{prestamo.id}</Card.Title>
              <Card.Subtitle className="text-muted">Estudiante: {estudianteNombre}</Card.Subtitle>
              <Card.Text className="mt-2">
                Fecha de Solicitud: {new Date(prestamo.fechaSolicitud).toLocaleDateString()} <br />
                Estado: <span className="badge bg-warning text-dark">{prestamo.estado}</span>
              </Card.Text>
            </div>

            <Button
              variant="success"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleAprobar();
              }}
              disabled={loading} // Deshabilitar botón mientras se aprueba
            >
              {loading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                <FaCheckCircle className="me-2" />
              )}
              {loading ? 'Cargando...' : 'Aprobar'}
            </Button>
          </Card.Body>
        </Card>
      </CSSTransition>
    </div>
  );
};

export default PrestamoCard;

