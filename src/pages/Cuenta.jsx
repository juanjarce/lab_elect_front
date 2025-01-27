import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Container, Form, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';  // Importar CSSTransition para las animaciones
import './css/Cuenta.css';  // Asegúrate de tener el archivo CSS para las animaciones

const Cuenta = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cuenta, setCuenta] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    cedula: '',
    name: '',
    address: '',
    numeroTelefono: '',
    email: ''
  });

  const [isLoading, setIsLoading] = useState(false);  // Estado para cargar los botones

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    setIsLoading(true); // Activar el estado de carga
    axios.get(`http://72.167.51.48:8082/api/estudiantes/informacion-cuenta/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setCuenta(response.data.data);
        setFormData(response.data.data);
        setIsLoading(false); // Desactivar el estado de carga
      })
      .catch(error => {
        setError('Error al obtener la información de la cuenta');
        console.error(error);
        setIsLoading(false); // Desactivar el estado de carga
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateAccount = async () => {
    setError('');
    setSuccessMessage('');
    setIsLoading(true);  // Activar el estado de carga cuando se presiona el botón

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    try {
      const response = await axios.put(`http://72.167.51.48:8082/api/estudiantes/actualizar/${id}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      setSuccessMessage(response.data.message);
      setIsLoading(false); // Desactivar el estado de carga
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Error al actualizar la información');
      console.error(error);
      setIsLoading(false); // Desactivar el estado de carga
    }
  };

  const handleDeleteAccount = async () => {
    setError('');
    setSuccessMessage('');
    setIsLoading(true);  // Activar el estado de carga cuando se presiona el botón

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        return;
      }
      const response = await axios.delete(`http://72.167.51.48:8082/api/estudiantes/eliminar/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage(response.data.message);
      localStorage.removeItem('token');
      navigate('/');
      setIsLoading(false); // Desactivar el estado de carga
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Error al eliminar la cuenta');
      console.error(error);
      setIsLoading(false); // Desactivar el estado de carga
    }
  };

  return (
    <Container className="mt-4">
      <h2>Mi Cuenta</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <CSSTransition in={cuenta !== null} timeout={500} classNames="fade" unmountOnExit>
        <div>
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

                  <Button variant="primary" onClick={handleUpdateAccount} disabled={isLoading}>
                    {isLoading ? <Spinner animation="border" size="sm" /> : <FaEdit />}
                    {isLoading ? ' Cargando...' : 'Actualizar Información'}
                  </Button>
                  <Button variant="danger" onClick={handleDeleteAccount} className="ms-3" disabled={isLoading}>
                    {isLoading ? <Spinner animation="border" size="sm" /> : <FaTrashAlt />}
                    {isLoading ? ' Cargando...' : 'Eliminar Cuenta'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <p>Cargando información...</p>
          )}
        </div>
      </CSSTransition>
    </Container>
  );
};

export default Cuenta;
