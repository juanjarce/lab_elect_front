import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Productos from './Productos'; // Importar el componente de productos
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isPrestamosOpen, setIsPrestamosOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Estado para el menú lateral
  const [selectedView, setSelectedView] = useState(''); // Estado para la vista seleccionada

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Limpiar el token o cualquier información de autenticación
    navigate('/'); // Redirige al Login
  };

  // Función para cambiar la vista seleccionada
  const handleMenuClick = (view) => {
    setSelectedView(view);
    setIsSidebarVisible(false); // Ocultar el menú lateral cuando se selecciona una opción
  };

  return (
    <div className="d-flex">
      {/* Menú Lateral */}
      <div className={`bg-dark text-white p-3 ${isSidebarVisible ? 'd-block' : 'd-none'}`} style={{ width: '250px', height: '100vh' }}>
        <h3 className="text-center">Admin Dashboard</h3>
        <ul className="nav flex-column mt-4">
          {/* Menú de Productos */}
          <li className="nav-item">
            <a
              className="nav-link text-white"
              href="#"
              onClick={() => handleMenuClick('productos')}
            >
              <i className="fas fa-cogs"></i> Productos
            </a>
          </li>

          {/* Menú de Préstamos */}
          <li className="nav-item">
            <a
              className="nav-link text-white"
              href="#"
              onClick={() => setIsPrestamosOpen(!isPrestamosOpen)}
            >
              <i className="fas fa-hand-holding"></i> Préstamos
            </a>
            {isPrestamosOpen && (
              <ul className="nav flex-column ms-3">
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    <i className="fas fa-file-alt"></i> SOLICITADOS
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    <i className="fas fa-check-circle"></i> PRESTADOS
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    <i className="fas fa-undo"></i> DEVUELTOS
                  </a>
                </li>
              </ul>
            )}
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
        
        {/* Mostrar la vista seleccionada */}
        {selectedView === 'productos' && <Productos />} {/* Mostrar productos cuando se selecciona la opción */}
      </div>

      {/* Botón para mostrar/ocultar el menú lateral */}
      <button 
        className="btn btn-light position-fixed" 
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        style={{
          top: '20px', 
          left: '20px',
          zIndex: 1000, 
          borderRadius: '50%', 
          padding: '10px', 
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        <i className={`fas ${isSidebarVisible ? 'fa-times' : 'fa-bars'}`} style={{ fontSize: '20px' }}></i>
      </button>
    </div>
  );
};

export default AdminDashboard;




