import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Autenticacion/Login";
import Register from "./pages/Autenticacion/Register";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import EstudianteDashboard from "./pages/EstudianteDashboard/EstudianteDashboard";
import ChangePassword from "./pages/Autenticacion/ChangePassword";
import VerificarCodigo from "./pages/Autenticacion/VerificarCodigo";
import ProductosPestaña from "./pages/EstudianteDashboard/ProductosPestaña";
import Carrito from "./pages/EstudianteDashboard/Carrito";
import Prestamos from "./pages/EstudianteDashboard/Prestamos";
import Cuenta from "./pages/EstudianteDashboard/Cuenta";
import Productos from "./pages/AdminDashboard/Productos";
import Solicitados from "./pages/AdminDashboard/Solicitados";
import Prestados from "./pages/AdminDashboard/Prestados";
import Devueltos from "./pages/AdminDashboard/Devueltos";
import GestionLaboratorios from "./pages/AdminDashboard/GestionLaboratorios";
import GestionReservas from "./pages/AdminDashboard/GestionReservas";
import Laboratorios from "./pages/EstudianteDashboard/Laboratorios";
import MisReservas from "./pages/EstudianteDashboard/MisReservas";
import Quejas from "./pages/EstudianteDashboard/Quejas";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        {/* AdminDashboard and subroutes */}
        <Route path="/admin-dashboard/:id" element={<AdminDashboard />}>
          <Route path="productos" element={<Productos />} />
          <Route path="prestamos/solicitados" element={<Solicitados />} />
          <Route path="prestamos/prestados" element={<Prestados />} />
          <Route path="prestamos/devueltos" element={<Devueltos />} />
          <Route
            path="laboratorios/configuracion"
            element={<GestionLaboratorios />}
          />
          <Route path="laboratorios/reservas" element={<GestionReservas />} />
        </Route>
        <Route
          path="/estudiante-dashboard/:id"
          element={<EstudianteDashboard />}
        >
          {/* Subroutes for the student */}
          <Route path="productos" element={<ProductosPestaña />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="prestamos" element={<Prestamos />} />
          <Route path="cuenta" element={<Cuenta />} />
          <Route path="laboratorios" element={<Laboratorios />} />
          <Route path="reservas" element={<MisReservas />} />
          <Route path="quejas" element={<Quejas />} />
        </Route>
        <Route path="/verificar-codigo/:id" element={<VerificarCodigo />} />
        <Route path="/recuperar-contrasenia" element={<ChangePassword />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
