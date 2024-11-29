import React from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const { id } = useParams(); // Obtén el id del admin
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

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
            <button className="btn btn-danger w-100" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Cerrar sesión
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido Principal */}
      <div className="p-4" style={{ width: '100%' }}>
        <h1>Bienvenido al Sistema de Gestión de Laboratorio de Electrónica</h1>

        {/* Mostrar las rutas seleccionadas */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
