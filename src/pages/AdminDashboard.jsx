import React, { useState } from 'react';
import { Link, Outlet, useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CSSTransition } from 'react-transition-group'; // Importamos para transiciones
import './css/AdminDashboard.css'; // Estilos para las transiciones

const AdminDashboard = () => {
  const { id } = useParams(); // Obtén el id del admin
  const navigate = useNavigate();
  const location = useLocation(); // Obtener la ubicación actual
  const [loading, setLoading] = useState(false); // Para gestionar la carga de los botones

  const handleLogout = async () => {
    setLoading(true); // Activar el efecto de carga en el botón
    try {
      const token = localStorage.getItem('token'); // Obtener el token de localStorage
      if (token) {
        // Realizar la solicitud para cerrar sesión
        const response = await axios.put(
          `http://localhost:8081/api/admin/logout/${id}`, 
          null, // Si es necesario, puedes enviar un objeto vacío o cualquier dato adicional
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Logout exitoso:', response.data);
      }

      // Limpiar el token y redirigir al login
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setLoading(false); // Desactivar el efecto de carga
    }
  };

  // Verificar si la URL es exactamente '/admin-dashboard/{idAdmin}'
  const isDashboardHome = location.pathname === `/admin-dashboard/${id}`;

  return (
    <div className="d-flex">
      {/* Menú Lateral */}
      <div className="bg-dark text-white p-3" style={{ width: '250px', height: '100vh' }}>
        <h3 className="text-center">Admin Dashboard</h3>
        <ul className="nav flex-column mt-4">
          {/* Menú de Productos */}
          <li className="nav-item">
            <Link className="nav-link text-white" to={`/admin-dashboard/${id}/productos`}>
              <i className="fas fa-cogs"></i> Productos
            </Link>
          </li>

          {/* Menú de Préstamos con submenú */}
          <li className="nav-item">
            <Link className="nav-link text-white" to="#" data-bs-toggle="collapse" data-bs-target="#prestamosMenu">
              <i className="fas fa-hand-holding"></i> Préstamos
            </Link>
            <ul className="collapse" id="prestamosMenu">
              <li className="nav-item">
                <Link className="nav-link text-white" to={`/admin-dashboard/${id}/prestamos/solicitados`}>
                  Solicitudes
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to={`/admin-dashboard/${id}/prestamos/prestados`}>
                  Prestados
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to={`/admin-dashboard/${id}/prestamos/devueltos`}>
                  Devueltos
                </Link>
              </li>
            </ul>
          </li>

          {/* Cerrar Sesión */}
          <li className="nav-item mt-4">
            <button
              className={`btn btn-danger w-100 ${loading ? 'disabled' : ''}`} 
              onClick={handleLogout}
              disabled={loading} // Deshabilitar el botón mientras se está procesando
            >
              <i className="fas fa-sign-out-alt"></i> 
              {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido Principal */}
      <div className="p-4" style={{ width: '100%' }}>

        <h1>Sistema de Gestión de Laboratorio de Electrónica</h1>

        {/* Transición de la imagen */}
        <CSSTransition
          in={isDashboardHome}
          timeout={500}
          classNames="fade"
          unmountOnExit
        >
          <div className="text-center mb-4">
            <img
              src="/src/recursos/ingelect.jpg" // Ruta relativa de la imagen
              alt="Laboratorio Electrónica"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </CSSTransition>

        {/* Mostrar las rutas seleccionadas */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
