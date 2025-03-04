import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import PrestamoCardEntregado from "./PrestamoCardEntregado";
import DetallesPrestamoForm from "./DetallesPrestamoForm";
import { Search } from "react-bootstrap-icons";
import { debounce } from "lodash";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./css/PrestamoCardEntregado.css";

const Prestados = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrestamoId, setSelectedPrestamoId] = useState(null);

  /**
   * fech all the loans
   * @param {*} page
   * @returns
   */
  const fetchPrestamos = async (page = 0, searchQuery = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      const response = await axios.get(
        `https://labuq.catavento.co:10443/api/admin/prestamos/prestados?page=${page}&size=100&search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status === "Éxito") {
        const prestamosWithNames = await Promise.all(
          response.data.data.content.map(async (prestamo) => {
            try {
              const estudianteResponse = await axios.get(
                `https://labuq.catavento.co:10443/api/admin/estudiante/info?id=${prestamo.idEstudiante}`,
              );
              const nombre = estudianteResponse.data.data.nombre;
              const cedula = estudianteResponse.data.data.cedula;
              return {
                ...prestamo,
                nombreEstudiante: nombre,
                cedulaEstudiante: cedula,
              };
            } catch {
              return {
                ...prestamo,
                nombreEstudiante: "Nombre no disponible",
                cedulaEstudiante: "Cédula no disponible",
              };
            }
          }),
        );
        setPrestamos(prestamosWithNames);
        setTotalPages(response.data.data.totalPages);
      } else {
        setError("No hay préstamos en estado PRESTADO.");
      }
    } catch (err) {
      console.log(err);
      setError("Error al cargar los préstamos en estado PRESTADO.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestamos(currentPage, search);
  }, [currentPage]);

  const handleEntregaPrestamo = async (idPrestamo) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      const response = await axios.put(
        `https://labuq.catavento.co:10443/api/admin/prestamos/devolver/${idPrestamo}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      alert(response.data.message || "Préstamo entregado con éxito.");
      fetchPrestamos(currentPage); // Recargar la lista tras entregar
    } catch (err) {
      alert(`${err.response?.data?.message}`);
    }
  };

  const handleVerDetalles = (prestamoId) => {
    setSelectedPrestamoId(prestamoId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPrestamoId(null);
  };

  /**
  * handles the search with a button click
  */
  const handleSearch = () => {
    fetchPrestamos(0, search);
    setCurrentPage(0);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>Préstamos Prestados</h3>

      <Form className="mb-4">
        <Row>
          <Col xs={12}>
           <InputGroup className="d-flex">
              <Form.Control
                type="text"
                placeholder="Buscar por ID, Nombre del Estudiante o Documento"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
              <Button variant="primary" onClick={handleSearch}>
                <Search />
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando préstamos...</span>
          </div>
        </div>
      ) : (
        <TransitionGroup className="row">
          {prestamos.length > 0 ? (
            prestamos.map((prestamo) => (
              <CSSTransition
                key={prestamo.id}
                timeout={500}
                classNames="card-transition"
                unmountOnExit
              >
                <PrestamoCardEntregado
                  prestamo={prestamo}
                  onVerDetalles={handleVerDetalles}
                  onEntregar={handleEntregaPrestamo}
                />
              </CSSTransition>
            ))
          ) : (
            <p className="text-center">No hay préstamos en estado PRESTADO.</p>
          )}
        </TransitionGroup>
      )}

      {/* Paginación */}
      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="secondary"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Anterior
        </Button>
        <span className="mx-3">
          Página {currentPage + 1} de {totalPages}
        </span>
        <Button
          variant="secondary"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Siguiente
        </Button>
      </div>

      {/* Modal de Detalles */}
      <DetallesPrestamoForm
        prestamoId={selectedPrestamoId}
        show={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Prestados;
