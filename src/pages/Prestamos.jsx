import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaFilter } from "react-icons/fa";
import DetallesPrestamoFormSinEntrega from "./DetallesPrestamoFormSinEntrega";
import { CSSTransition } from "react-transition-group"; // Importar para animaciones
import "./css/Prestamos.css";

const Prestamos = () => {
  const { id } = useParams();
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const pageSize = 30;

  /**
   * fetch the loans
   * */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    const fetchPrestamos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8081/api/estudiantes/${id}/prestamos?page=${currentPage}&size=${pageSize}&token=${token}`,
        );
        setPrestamos(response.data.content || []);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching prestamos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamos();
  }, [id, currentPage]);

  /**
   * handles the selection of a loan
   * @param {*} prestamoId
   */
  const handleSelectPrestamo = (prestamoId) => {
    const selected = prestamos.find((prestamo) => prestamo.id === prestamoId);
    setSelectedPrestamo(selected);
    setShowModal(true);
  };

  /**
   * handles the close modal
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPrestamo(null);
  };

  /**
   * handles the pag change
   * @param {*} page
   * @returns
   */
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <CSSTransition in={!loading} timeout={500} classNames="fade" unmountOnExit>
      <div className="container mt-4">
        <h2>Mis Préstamos</h2>

        {loading ? (
          <div>Cargando...</div>
        ) : (
          <>
            <div className="d-flex mb-4">
            </div>
            {prestamos.length === 0 ? (
              <div>
                No se encontró historial de préstamos para este estudiante.
              </div>
            ) : (
              <div className="row">
                {prestamos.map((prestamo) => (
                  <div
                    key={prestamo.id}
                    className="col-12 col-md-4 col-lg-4 mb-4"
                    onClick={() => handleSelectPrestamo(prestamo.id)}
                  >
                    <div className="card shadow-sm producto-card" style={{ height: "180px" }}>
                      <div className="card-body bg-light">
                        <h5 className="card-title">
                          Préstamo ID: {prestamo.id}
                        </h5>
                        <p className="card-text">Estado: {prestamo.estado}</p>
                        <p className="card-text">
                          Fecha de Préstamo: {prestamo.fechaPrestamo}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="d-flex justify-content-center mt-4">
              <button
                className="btn btn-outline-secondary me-2"
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Anterior
              </button>
              <span>
                Página {currentPage + 1} de {totalPages}
              </span>
              <button
                className="btn btn-outline-secondary ms-2"
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Siguiente
              </button>
            </div>

            <DetallesPrestamoFormSinEntrega
              show={showModal}
              onClose={handleCloseModal}
              prestamoId={selectedPrestamo?.id}
            />
          </>
        )}
      </div>
    </CSSTransition>
  );
};

export default Prestamos;
