import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import EstudianteDashboard from "./pages/EstudianteDashboard";
import ChangePassword from "./pages/ChangePassword";
import VerificarCodigo from "./pages/VerificarCodigo";
import ProductosPestaña from "./pages/ProductosPestaña";
import Carrito from "./pages/Carrito";
import Prestamos from "./pages/Prestamos";
import Cuenta from "./pages/Cuenta";
import Productos from "./pages/Productos";
import Solicitados from "./pages/Solicitados";
import Prestados from "./pages/Prestados";
import Devueltos from "./pages/Devueltos";
import GestionLaboratorios from "./pages/GestionLaboratorios";
import GestionReservas from "./pages/GestionReservas";
import Laboratorios from "./pages/Laboratorios";
import MisReservas from "./pages/MisReservas";
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
        </Route>
        <Route path="/verificar-codigo/:id" element={<VerificarCodigo />} />
        <Route path="/recuperar-contrasenia" element={<ChangePassword />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
