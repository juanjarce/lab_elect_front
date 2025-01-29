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
import Productos from './pages/Productos'; // Componente para la pestaña "Cuenta"
import Solicitados from './pages/Solicitados'; // Componente para la pestaña "Cuenta"
import Prestados from './pages/Prestados'; // Componente para la pestaña "Cuenta"
import Devueltos from './pages/Devueltos'; // Componente para la pestaña "Cuenta"
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa el JS de Bootstrap para que los colapsables funcionen


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        {/* AdminDashboard y sus subrutas */}
        <Route path="/admin-dashboard/:id" element={<AdminDashboard />}>
          <Route path="productos" element={<Productos />} />
          <Route path="prestamos/solicitados" element={<Solicitados />} />
          <Route path="prestamos/prestados" element={<Prestados />} />
          <Route path="prestamos/devueltos" element={<Devueltos />} />
          {/* Aquí puedes agregar más rutas según las secciones del Admin */}
        </Route>
        <Route path="/estudiante-dashboard/:id" element={<EstudianteDashboard />}>
          {/* Subrutas específicas del dashboard del estudiante */}
          <Route path="productos" element={<ProductosPestaña />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="prestamos" element={<Prestamos />} />
          <Route path="cuenta" element={<Cuenta />} />
        </Route>
        <Route path="/verificar-codigo/:id" element={<VerificarCodigo />} />
        <Route path="/recuperar-contrasenia" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
