import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa'; // Icono para aprobar

const PrestamoCard = ({ prestamo, onVerDetalles, onAprobar }) => {
  const [estudianteNombre, setEstudianteNombre] = useState('');

  useEffect(() => {
    const fetchEstudianteName = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/admin/estudiante/nombre?id=${prestamo.idEstudiante}`);
        setEstudianteNombre(response.data.data.nombre);
      } catch (err) {
        setEstudianteNombre('Nombre no disponible');
      }
    };
    fetchEstudianteName();
  }, [prestamo.idEstudiante]);

  const handleAprobar = async () => {
    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token'); 
      console.log(token);
  
      // Verificar si el token existe
      if (!token) {
        console.error('Token no encontrado');
        return;
      }

      console.log(token);
      
      const response = await axios.put(
        `http://localhost:8081/api/admin/prestamos/aprobar/${prestamo.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
        }
      );
      if (response.data.status === 'Exito') {
        alert('Préstamo aprobado exitosamente.');
        onAprobar(); // Notificar a Solicitados.jsx para recargar
      } else {
        alert('Error al aprobar el préstamo.');
      }
    } catch (error) {
      alert('Error al aprobar el préstamo.');
    }
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-4">
      <Card className="mb-3 shadow-sm" onClick={() => onVerDetalles(prestamo.id)} style={{ cursor: 'pointer' }}>
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Title className="mb-1">Préstamo #{prestamo.id}</Card.Title>
            <Card.Subtitle className="text-muted">Estudiante: {estudianteNombre || 'No disponible'}</Card.Subtitle>
            <Card.Text className="mt-2">
              Fecha de Solicitud: {new Date(prestamo.fechaSolicitud).toLocaleDateString()} <br />
              Estado: <span className="badge bg-warning text-dark">{prestamo.estado}</span>
            </Card.Text>
          </div>

          <Button
            variant="success"
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // Evitar que se dispare el modal al hacer clic
              handleAprobar();
            }}
          >
            <FaCheckCircle className="me-2" />
            Aprobar
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PrestamoCard;

