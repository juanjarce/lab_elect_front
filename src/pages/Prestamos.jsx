import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap'; // Importamos los componentes de Bootstrap
import DetallesPrestamoForm from './DetallesPrestamoForm'; // Importamos el componente DetallesPrestamoForm

const Prestamos = () => {
  const { id } = useParams();
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [selectedPrestamo, setSelectedPrestamo] = useState(null); // Prestamo seleccionado
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const [totalPages, setTotalPages] = useState(0); // Total de páginas disponibles
  const [showModal, setShowModal] = useState(false); // Estado del modal

  useEffect(() => {
    const fetchPrestamos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8081/api/estudiantes/${id}/prestamos?page=${currentPage}&size=5`);
        setPrestamos(response.data.content || []); // Ajustar según la estructura de la respuesta
        setTotalPages(response.data.totalPages); // Total de páginas
      } catch (error) {
        console.error('Error fetching prestamos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamos();
  }, [id, currentPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setEstadoFilter(event.target.value);
  };

  const handleSelectPrestamo = (prestamoId) => {
    const selected = prestamos.find((prestamo) => prestamo.id === prestamoId);
    setSelectedPrestamo(selected); // Guardamos el préstamo seleccionado
    setShowModal(true); // Abrir el modal
  };  

  const handleCloseModal = () => {
    setShowModal(false); // Cerrar el modal
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Cambiar la página
  };

  const filteredPrestamos = prestamos.filter((prestamo) => {
    const matchesSearch = prestamo.id.toString().includes(searchTerm) || prestamo.fechaPrestamo.includes(searchTerm);
    const matchesEstado = estadoFilter ? prestamo.estado === estadoFilter : true;
    return matchesSearch && matchesEstado;
  });

  return (
    <div className="container mt-4">
      <h2>Mis Préstamos</h2>

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <>
          <div className="d-flex mb-4">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar por ID o Fecha"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="btn btn-outline-secondary">
              <FaSearch />
            </button>
            <select
              className="form-select ms-2"
              value={estadoFilter}
              onChange={handleFilterChange}
            >
              <option value="">Filtrar por Estado</option>
              <option value="PRESTADO">PRESTADO</option>
              <option value="DEVUELTO">DEVUELTO</option>
            </select>
            <button className="btn btn-outline-secondary ms-2">
              <FaFilter />
            </button>
          </div>

          {filteredPrestamos.length === 0 ? (
            <div>No se encontró historial de préstamos para este estudiante.</div>
          ) : (
            <div className="row">
              {filteredPrestamos.map((prestamo) => (
                <div
                  key={prestamo.id}
                  className="col-12 col-md-6 col-lg-4 mb-4"
                  onClick={() => handleSelectPrestamo(prestamo.id)} // Al hacer clic selecciona el préstamo
                >
                  <div className="card shadow-sm">
                    <div className="card-body bg-light">
                      <h5 className="card-title">Préstamo ID: {prestamo.id}</h5>
                      <p className="card-text">Estado: {prestamo.estado}</p>
                      <p className="card-text">Fecha de Préstamo: {prestamo.fechaPrestamo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-secondary me-2"
              disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Anterior
            </button>
            <span>Página {currentPage + 1} de {totalPages}</span>
            <button
              className="btn btn-outline-secondary ms-2"
              disabled={currentPage === totalPages - 1}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente
            </button>
          </div>

          {/* Modal con los detalles del préstamo */}
          <DetallesPrestamoForm
            show={showModal}
            onClose={handleCloseModal}
            prestamoId={selectedPrestamo?.id} // Pasamos el id del préstamo
          />
        </>
      )}
    </div>
  );
};

export default Prestamos;

