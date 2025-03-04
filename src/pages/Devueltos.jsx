import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Row, Col, Button } from "react-bootstrap";
import PrestamoCardDevueltos from "./PrestamoCardDevueltos";
import DetallesPrestamoForm from "./DetallesPrestamoForm";
import { debounce } from "lodash";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./css/PrestamoCardDevueltos.css";

const Devueltos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [filteredPrestamos, setFilteredPrestamos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrestamoId, setSelectedPrestamoId] = useState(null);

  /**
   * handles the loans fetch
   * @param {*} page
   * @returns
   */
  const fetchPrestamos = async (page = 0) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      const response = await axios.get(
        `http://localhost:8081/api/admin/prestamos/devueltos?page=${page}&size=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status === "Exito") {
        const prestamosWithNames = await Promise.all(
          response.data.data.content.map(async (prestamo) => {
            try {
              const estudianteResponse = await axios.get(
                `http://localhost:8081/api/admin/estudiante/info?id=${prestamo.idEstudiante}`,
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
        setFilteredPrestamos(prestamosWithNames);
        setTotalPages(response.data.data.totalPages);
      } else {
        setError("No hay préstamos en estado DEVUELTO.");
      }
    } catch (error) {
      setError("Error al cargar los préstamos en estado DEVUELTO.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * handles the details by setting the selected prestamo and show modal
   * @param {*} prestamoId
   */
  const handleVerDetalles = (prestamoId) => {
    setSelectedPrestamoId(prestamoId);
    setShowModal(true);
  };

  /**
   * handles the close modal by setting the show modal and prestamo
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPrestamoId(null);
  };

  /**
   * handles the functionality when search condition change
   */
  const handleSearchChange = debounce((value) => {
    setSearch(value);
    if (value === "") {
      setFilteredPrestamos(prestamos);
    } else {
      const lowercasedSearch = value.toLowerCase();
      const filtered = prestamos.filter(
        (prestamo) =>
          prestamo.id.toString().includes(lowercasedSearch) ||
          prestamo.nombreEstudiante?.toLowerCase().includes(lowercasedSearch) ||
          prestamo.cedulaEstudiante.toString().includes(lowercasedSearch),
      );
      setFilteredPrestamos(filtered);
    }
  }, 300);

  /**
   * handle the change of page
   * */
  useEffect(() => {
    fetchPrestamos(currentPage);
  }, [currentPage]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>Préstamos Devueltos</h3>

      <Form className="mb-4">
        <Row>
          <Col xs={12}>
            <Form.Control
              type="text"
              placeholder="Buscar por ID, Nombre del Estudiante o Documento"
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-100"
            />
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              Cargando préstamos devueltos...
            </span>
          </div>
        </div>
      ) : (
        <TransitionGroup className="row">
          {filteredPrestamos.length > 0 ? (
            filteredPrestamos.map((prestamo) => (
              <CSSTransition
                key={prestamo.id}
                timeout={500}
                classNames="card-transition"
                unmountOnExit
              >
                <PrestamoCardDevueltos
                  prestamo={prestamo}
                  onVerDetalles={handleVerDetalles}
                />
              </CSSTransition>
            ))
          ) : (
            <p className="text-center">No hay préstamos en estado DEVUELTO.</p>
          )}
        </TransitionGroup>
      )}

      {/* Pagination */}
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

      {/* Details modal */}
      <DetallesPrestamoForm
        prestamoId={selectedPrestamoId}
        show={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Devueltos;
