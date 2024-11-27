import React from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa'; // Ícono de cierre de sesión

const EstudianteDashboard = () => {
  const { id } = useParams(); // Captura el id de la URL
  const navigate = useNavigate();

  // Eliminar la redirección automática para evitar conflicto
  // React.useEffect(() => {
  //   navigate(`/estudiante-dashboard/${id}/productos`);
  // }, [navigate, id]);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Limpiar el token o cualquier información de autenticación
    navigate('/'); // Redirigir al login
  };

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
        {/* Renderiza las subrutas */}
        <Outlet />
      </Container>
    </>
  );
};

export default EstudianteDashboard;




