import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import EstudianteDashboard from './pages/EstudianteDashboard';
import ChangePassword from './pages/ChangePassword';
import VerificarCodigo from './pages/VerificarCodigo';  // Importa el componente de verificación
import './index.css';  // Asegúrate de que este archivo esté en la ruta correcta
import 'bootstrap/dist/css/bootstrap.min.css';  // Asegúrate de que este import esté presente


const App = () => {
  return (
    <BrowserRouter>  {/* El BrowserRouter debe envolver las rutas */}
      <Routes>
        <Route path="/" element={<Login />} />  {/* Ruta principal a Login */}
        <Route path="/registro" element={<Register />} />  {/* Ruta para registro */}
        <Route path="/admin-dashboard/:id" element={<AdminDashboard />} />
        <Route path="/estudiante-dashboard/:id" element={<EstudianteDashboard />} />
        <Route path="/verificar-codigo/:id" element={<VerificarCodigo />} /> {/* Ruta con parámetro id */}
        <Route path="/recuperar-contraseña" element={<ChangePassword />} />  {/* Ruta para registro */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;







