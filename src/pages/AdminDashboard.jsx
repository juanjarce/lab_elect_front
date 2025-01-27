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
          `http://72.167.51.48:8082/api/admin/logout/${id}`, 
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
              src="data:image/jpeg;base64,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" // Ruta relativa de la imagen
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
