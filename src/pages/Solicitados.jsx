import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';
import PrestamoCard from './PrestamoCard';
import DetallesPrestamoModal from './DetallesPrestamoModal';
import { debounce } from 'lodash';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const Solicitados = () => {
  const [prestamos, setPrestamos] = useState([]); // Préstamos de la página actual
  const [todosPrestamos, setTodosPrestamos] = useState([]); // Todos los préstamos cargados
  const [filteredPrestamos, setFilteredPrestamos] = useState([]); // Préstamos filtrados
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrestamoId, setSelectedPrestamoId] = useState(null);

  const fetchPrestamos = async (page = 0) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        return;
      }

      const response = await axios.get(`https://labuq.catavento.co:10443/api/admin/prestamos/solicitados?page=${page}&size=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 'Exito') {
        const prestamosWithDetails = await Promise.all(
          response.data.data.content.map(async (prestamo) => {
            try {
              const estudianteResponse = await axios.get(`https://labuq.catavento.co:10443/api/admin/estudiante/info?id=${prestamo.idEstudiante}`);
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
                nombreEstudiante: 'Nombre no disponible',
                cedulaEstudiante: 'Cédula no disponible',
              };
            }
          })
        );

        setPrestamos(prestamosWithDetails); // Set the current page of prestamos
        setTodosPrestamos((prev) => [...prev, ...prestamosWithDetails]); // Accumulate all loaded prestamos
        setFilteredPrestamos((prev) => [...prev, ...prestamosWithDetails]); // Set filtered prestamos to include all loaded
        setTotalPages(Math.ceil(response.data.data.totalElements / 5)); // Update total pages based on all data
      } else {
        setError('No hay préstamos solicitados.');
      }
    } catch (err) {
      setError('Error al cargar los préstamos solicitados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestamos(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (search === '') {
      setFilteredPrestamos(todosPrestamos); // Reset to show all data if no search
    } else {
      const lowercasedSearch = search.toLowerCase();
      const filtered = todosPrestamos.filter(
        (prestamo) =>
          prestamo.id.toString().includes(lowercasedSearch) ||
          prestamo.nombreEstudiante?.toLowerCase().includes(lowercasedSearch) ||
          prestamo.cedulaEstudiante.toString().includes(lowercasedSearch)
      );
      setFilteredPrestamos(filtered);
    }
  }, [search, todosPrestamos]);

  const handleVerDetalles = (prestamoId) => {
    setSelectedPrestamoId(prestamoId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPrestamoId(null);
  };

  const handleSearchChange = debounce((value) => {
    setSearch(value);
  }, 300);

  // Paginate filtered prestamos
  const paginatedPrestamos = filteredPrestamos.slice(currentPage * 5, (currentPage + 1) * 5);

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
            />
          </Col>
        </Row>
      </Form>

      <div className="row">
        <TransitionGroup className="row">
          {paginatedPrestamos.length > 0 ? (
            paginatedPrestamos.map((prestamo) => (
              <CSSTransition key={prestamo.id} timeout={500} classNames="card-transition">
                <PrestamoCard
                  prestamo={prestamo}
                  onVerDetalles={handleVerDetalles}
                  onAprobar={() => fetchPrestamos()}
                />
              </CSSTransition>
            ))
          ) : (
            <p>No hay resultados para mostrar</p>
          )}
        </TransitionGroup>
      </div>

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

      <DetallesPrestamoModal
        prestamoId={selectedPrestamoId}
        show={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Solicitados;
