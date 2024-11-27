import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import EstudianteDashboard from './pages/EstudianteDashboard';
import ChangePassword from './pages/ChangePassword';
import VerificarCodigo from './pages/VerificarCodigo';
import ProductosPestaña from './pages/ProductosPestaña'; // Importa el componente
import Carrito from './pages/Carrito'; // Componente para la pestaña "Carrito"
import Prestamos from './pages/Prestamos'; // Componente para la pestaña "Prestamos"
import Cuenta from './pages/Cuenta'; // Componente para la pestaña "Cuenta"
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/admin-dashboard/:id" element={<AdminDashboard />} />
        <Route path="/estudiante-dashboard/:id" element={<EstudianteDashboard />}>
          {/* Subrutas específicas del dashboard del estudiante */}
          <Route path="productos" element={<ProductosPestaña />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="prestamos" element={<Prestamos />} />
          <Route path="cuenta" element={<Cuenta />} />
        </Route>
        <Route path="/verificar-codigo/:id" element={<VerificarCodigo />} />
        <Route path="/recuperar-contraseña" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;









