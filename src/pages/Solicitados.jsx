import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Row, Col, Button } from "react-bootstrap";
import PrestamoCard from "./PrestamoCard";
import DetallesPrestamoModal from "./DetallesPrestamoModal";
import { debounce } from "lodash";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const Solicitados = () => {
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
      console.log(token);
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      const response = await axios.get(
        `http://localhost:8081/api/admin/prestamos/solicitados?page=${page}&size=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.status === "Exito") {
        const prestamosWithDetails = await Promise.all(
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
        setPrestamos(prestamosWithDetails);
        setFilteredPrestamos(prestamosWithDetails); // Mostrar todos inicialmente
        setTotalPages(response.data.data.totalPages);
      } else {
        setError("No hay préstamos solicitados.");
      }
    } catch (err) {
      setError("Error al cargar los préstamos solicitados.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestamos(currentPage);
  }, [currentPage]);

  /**
   * handles the details showing the modal
   * @param {*} prestamoId
   */
  const handleVerDetalles = (prestamoId) => {
    setSelectedPrestamoId(prestamoId);
    setShowModal(true);
  };

  /**
   * handles the close modal for the detail
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPrestamoId(null);
  };

  /**
   * handles the search
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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>Préstamos Solicitados</h3>

      <Form className="mb-4">
        <Row>
          <Col xs={12}>
            <Form.Control
              type="text"
              placeholder="Buscar por ID, Nombre del Estudiante o Documento"
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-100"
              disabled={true} // Barra de búsqueda deshabilitada
            />
          </Col>
        </Row>
      </Form>

      {/* Mostrar un spinner mientras se cargan los préstamos */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      <div className="row">
        <TransitionGroup className="row">
          {filteredPrestamos.length > 0
            ? filteredPrestamos.map((prestamo, index) => (
                <CSSTransition
                  key={prestamo.id}
                  timeout={500}
                  classNames="card-transition"
                >
                  <PrestamoCard
                    prestamo={prestamo}
                    onVerDetalles={handleVerDetalles}
                    onAprobar={() => fetchPrestamos(currentPage)}
                  />
                </CSSTransition>
              ))
            : !loading && <p>No hay préstamos solicitados.</p>}
        </TransitionGroup>
      </div>

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

      <DetallesPrestamoModal
        prestamoId={selectedPrestamoId}
        show={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Solicitados;

