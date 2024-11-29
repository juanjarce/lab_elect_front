import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import axios from 'axios';

const PrestamoCard = ({ prestamo, onVerDetalles }) => {
  const [estudianteNombre, setEstudianteNombre] = useState('');

  // Función para obtener el nombre del estudiante
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
      <Card className="mb-3" onClick={() => onVerDetalles(prestamo.id)} style={{ cursor: 'pointer' }}>
        <Card.Body>
          <Card.Title>Préstamo ID: {prestamo.id}</Card.Title>
          <Card.Text>Fecha Solicitud: {new Date(prestamo.fechaSolicitud).toLocaleDateString()}</Card.Text>
          <Card.Text>Estado: {prestamo.estado}</Card.Text>
          <Card.Text>Estudiante: {estudianteNombre}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PrestamoCard;
