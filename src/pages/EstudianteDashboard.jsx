import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Spinner } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa'; // Ícono de cierre de sesión
import axios from 'axios'; // Importamos axios
import { CSSTransition } from 'react-transition-group'; // Para animaciones
import './css/EstudianteDashboard.css'; // Estilos para las transiciones

const EstudianteDashboard = () => {
  const { id } = useParams(); // Captura el id de la URL
  const navigate = useNavigate();
  const location = useLocation(); // Obtener la ubicación actual
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar el spinner de carga
  const [showContent, setShowContent] = useState(true); // Controla la transición de aparición

  const handleLogout = async () => {
    setIsLoading(true); // Activar estado de carga
    try {
      const token = localStorage.getItem('token'); // Obtener el token de localStorage
      if (token) {
        // Realizar la solicitud para cerrar sesión
        const response = await axios.put(
          `http://localhost:8081/api/estudiantes/logout/${id}`,
          null, // Si es necesario, puedes enviar un objeto vacío o cualquier dato adicional
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Logout exitoso:', response.data);
      }

      // Limpiar el token y redirigir al login
      localStorage.removeItem('token');
      navigate('/'); // Redirigir al login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false); // Desactivar estado de carga
    }
  };

  // Verificar si la URL es exactamente '/estudiante-dashboard/{idEstudiante}'
  const isDashboardHome = location.pathname === `/estudiante-dashboard/${id}`;

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#">Laboratorio Electrónica</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="productos">Productos</Nav.Link>
              <Nav.Link as={Link} to="carrito">Carrito</Nav.Link>
              <Nav.Link as={Link} to="prestamos">Mis Préstamos</Nav.Link>
              <Nav.Link as={Link} to="cuenta">Mi Cuenta</Nav.Link>
            </Nav>
            {/* Botón de cerrar sesión */}
            <Button 
              variant="link" 
              onClick={handleLogout} 
              style={{ padding: '0', color: 'black', fontSize: '1.5rem' }}
              disabled={isLoading} // Deshabilitar durante la carga
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" /> // Mostrar spinner si está cargando
              ) : (
                <FaSignOutAlt /> // Ícono de logout
              )}
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {/* Transición de aparición del contenido */}
        <CSSTransition
          in={showContent}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <>
            {/* Mostrar la imagen solo si estamos en '/estudiante-dashboard/{idEstudiante}' */}
            {isDashboardHome && (
              <div className="text-center mb-4">
                <img
                  src="/public/images/ingelect.jpg" // Ruta relativa de la imagen
                  alt="Laboratorio Electrónica"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            )}

            {/* Renderiza las subrutas */}
            <Outlet />
          </>
        </CSSTransition>
      </Container>
    </>
  );
};

export default EstudianteDashboard;


