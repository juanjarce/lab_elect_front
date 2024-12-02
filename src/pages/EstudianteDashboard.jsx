import React from 'react';
import { Link, Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa'; // Ícono de cierre de sesión

const EstudianteDashboard = () => {
  const { id } = useParams(); // Captura el id de la URL
  const navigate = useNavigate();
  const location = useLocation(); // Obtener la ubicación actual

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Limpiar el token o cualquier información de autenticación
    navigate('/'); // Redirigir al login
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
            >
              <FaSignOutAlt /> {/* Ícono de logout */}
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {/* Mostrar la imagen solo si estamos en '/estudiante-dashboard/{idEstudiante}' */}
        {isDashboardHome && (
          <div className="text-center mb-4">
            <img
              src="/src/recursos/ingelect.jpg" // Ruta relativa de la imagen
              alt="Laboratorio Electrónica"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        )}

        {/* Renderiza las subrutas */}
        <Outlet />
      </Container>
    </>
  );
};

export default EstudianteDashboard;

