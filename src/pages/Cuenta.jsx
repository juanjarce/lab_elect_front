import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

const Cuenta = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el id del estudiante desde la URL
  const [cuenta, setCuenta] = useState(null);
  const [error, setError] = useState(''); // Para almacenar errores
  const [successMessage, setSuccessMessage] = useState(''); // Para almacenar mensajes de éxito
  const [formData, setFormData] = useState({
    cedula: '',
    name: '',
    address: '',
    numeroTelefono: '',
    email: ''
  });

  useEffect(() => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token'); 
    console.log(token);

    // Verificar si el token existe
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    // Obtener la información de la cuenta del estudiante
    axios.get(`http://localhost:8081/api/estudiantes/informacion-cuenta/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token al encabezado
        },
      }
    )
      .then(response => {
        setCuenta(response.data.data);
        setFormData(response.data.data); // Prellenar el formulario con los datos obtenidos
      })
      .catch(error => {
        setError('Error al obtener la información de la cuenta');
        console.error(error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateAccount = async () => {
    setError(''); // Limpiar cualquier mensaje de error previo
    setSuccessMessage(''); // Limpiar cualquier mensaje de éxito previo

    // Obtener el token del localStorage
    const token = localStorage.getItem('token'); 
    console.log(token);

    // Verificar si el token existe
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8081/api/estudiantes/actualizar/${id}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
        });
      setSuccessMessage(response.data.message); // Mostrar el mensaje de éxito
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Error al actualizar la información');
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    setError(''); // Limpiar cualquier mensaje de error previo
    setSuccessMessage(''); // Limpiar cualquier mensaje de éxito previo

    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token'); 
      console.log(token);
  
      // Verificar si el token existe
      if (!token) {
        console.error('Token no encontrado');
        return;
      }
      const response = await axios.delete(`http://localhost:8081/api/estudiantes/eliminar/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
        }
      );
      setSuccessMessage(response.data.message); // Mostrar el mensaje de éxito

      localStorage.removeItem('token'); // Limpiar el token o cualquier información de autenticación
      navigate('/'); // Redirige al Login
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Error al eliminar la cuenta');
      console.error(error);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Mi Cuenta</h2>

      {/* Mostrar mensaje de error si hay */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Mostrar mensaje de éxito si hay */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {cuenta ? (
        <Card>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label><FaUser /> Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><FaEnvelope /> Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><FaPhone /> Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="numeroTelefono"
                  value={formData.numeroTelefono}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><FaMapMarkerAlt /> Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><FaUser /> Cédula</Form.Label>
                <Form.Control
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Button variant="primary" onClick={handleUpdateAccount}>
                <FaEdit /> Actualizar Información
              </Button>
              <Button variant="danger" onClick={handleDeleteAccount} className="ms-3">
                <FaTrashAlt /> Eliminar Cuenta
              </Button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <p>Cargando información...</p>
      )}
    </Container>
  );
};

export default Cuenta;


