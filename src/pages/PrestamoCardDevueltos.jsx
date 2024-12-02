import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import axios from 'axios';

const PrestamoCardDevueltos = ({ prestamo, onVerDetalles }) => {
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

  return (
    <div className="col-sm-12 col-md-6 col-lg-4">
      <Card className="mb-3 shadow-sm" onClick={() => onVerDetalles(prestamo.id)} style={{ cursor: 'pointer' }}>
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Title className="mb-1">Préstamo #{prestamo.id}</Card.Title>
            <Card.Subtitle className="text-muted">Estudiante: {estudianteNombre || 'No disponible'}</Card.Subtitle>
            <Card.Text className="mt-2">
              Fecha de Solicitud: {new Date(prestamo.fechaSolicitud).toLocaleDateString()} <br />
              Estado: <span className="badge bg-success">{prestamo.estado}</span>
            </Card.Text>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PrestamoCardDevueltos;
