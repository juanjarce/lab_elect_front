import { useState, useEffect } from "react";
import { Link, Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { CSSTransition } from "react-transition-group";
import "./css/AdminDashboard.css";

const AdminDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // En grande, siempre abierto
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.put(
          `http://localhost:8081/api/admin/logout/${id}`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  const isDashboardHome = location.pathname === `/admin-dashboard/${id}`;

  return (
    <div className="d-flex">
      {/* Botón de menú solo en móviles */}
      {isMobile && (
        <button
          className="btn toggle-sidebar-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <i className="fas fa-bars fa-lg text-dark"></i>
        </button>
      )}

      {/* Side Menu */}
      {sidebarOpen && (
        <div className="text-white p-3 sidebar">
          <h3 className="text-center">Admin Dashboard</h3>
          <ul className="nav flex-column mt-4">
            {/* Lab Menu */}
            <li className="nav-item">
              <Link
                className="nav-link text-white"
                to="#"
                data-bs-toggle="collapse"
                data-bs-target="#laboratorioMenu"
              >
                <i className="fas fa-flask"></i> Laboratorio
              </Link>
              <ul className="collapse" id="laboratorioMenu">
                <li className="nav-item">
                  <Link
                    className="nav-link text-white"
                    to={`/admin-dashboard/${id}/laboratorios/configuracion`}
                  >
                    Configuración
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link text-white"
                    to={`/admin-dashboard/${id}/laboratorios/reservas`}
                  >
                    Reservas
                  </Link>
                </li>
              </ul>
            </li>

            {/* Products menu */}
            <li className="nav-item">
              <Link
                className="nav-link text-white"
                to={`/admin-dashboard/${id}/productos`}
              >
                <i className="fas fa-cogs"></i> Productos
              </Link>
            </li>

            {/* Loans menu */}
            <li className="nav-item">
              <Link
                className="nav-link text-white"
                to="#"
                data-bs-toggle="collapse"
                data-bs-target="#prestamosMenu"
              >
                <i className="fas fa-hand-holding"></i> Préstamos
              </Link>
              <ul className="collapse" id="prestamosMenu">
                <li className="nav-item">
                  <Link
                    className="nav-link text-white"
                    to={`/admin-dashboard/${id}/prestamos/solicitados`}
                  >
                    Solicitudes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link text-white"
                    to={`/admin-dashboard/${id}/prestamos/prestados`}
                  >
                    Prestados
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link text-white"
                    to={`/admin-dashboard/${id}/prestamos/devueltos`}
                  >
                    Devueltos
                  </Link>
                </li>
              </ul>
            </li>

            {/* Log out */}
            <li className="nav-item mt-4">
              <button
                className={`btn btn-danger w-100 ${loading ? "disabled" : ""}`}
                onClick={handleLogout}
                disabled={loading}
              >
                <i className="fas fa-sign-out-alt"></i>
                {loading ? "Cerrando sesión..." : "Cerrar sesión"}
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Principal content */}
      <div className="p-4 main-content" style={{ width: "100%" }}>
        <h1>Sistema de Gestión de Laboratorio de Electrónica</h1>

        <CSSTransition
          in={isDashboardHome}
          timeout={500}
          classNames="fade"
          unmountOnExit
        >
          <div className="text-center mb-4">
            <img
              src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
              alt="Laboratorio Electrónica"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        </CSSTransition>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;