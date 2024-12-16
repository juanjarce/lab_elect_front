import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';
import PrestamoCard from './PrestamoCard'; // Importar el componente PrestamoCard
import DetallesPrestamoModal from './DetallesPrestamoModal'; // Importar el modal de detalles
import { debounce } from 'lodash'; // Usar lodash para debounce
import { TransitionGroup, CSSTransition } from 'react-transition-group'; // Importar TransitionGroup y CSSTransition

const Solicitados = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [filteredPrestamos, setFilteredPrestamos] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false); // Controla si el modal se muestra
  const [selectedPrestamoId, setSelectedPrestamoId] = useState(null); // Guarda el ID del préstamo seleccionado

  const fetchPrestamos = async (page = 0) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); 
      console.log(token);
  
      if (!token) {
        console.error('Token no encontrado');
        return;
      }
      
      const response = await axios.get(`http://localhost:8081/api/admin/prestamos/solicitados?page=${page}&size=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status === 'Exito') {
        const prestamosWithDetails = await Promise.all(
          response.data.data.content.map(async (prestamo) => {
            try {
              // Obtener nombre y cedula
              const estudianteResponse = await axios.get(`http://localhost:8081/api/admin/estudiante/info?id=${prestamo.idEstudiante}`);
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
        setPrestamos(prestamosWithDetails);
        setFilteredPrestamos(prestamosWithDetails); // Mostrar todos inicialmente
        setTotalPages(response.data.data.totalPages);
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

  const handleVerDetalles = (prestamoId) => {
    setSelectedPrestamoId(prestamoId);
    setShowModal(true); // Mostrar el modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPrestamoId(null); // Limpiar el ID del préstamo seleccionado
  };

  const handleSearchChange = debounce((value) => {
    setSearch(value);
    if (value === '') {
      setFilteredPrestamos(prestamos); // Restablecer la lista si no hay búsqueda
    } else {
      const lowercasedSearch = value.toLowerCase();
      const filtered = prestamos.filter(
        (prestamo) =>
          prestamo.id.toString().includes(lowercasedSearch) ||
          prestamo.nombreEstudiante?.toLowerCase().includes(lowercasedSearch) ||
          prestamo.cedulaEstudiante.toString().includes(lowercasedSearch)
      );
      setFilteredPrestamos(filtered);
    }
  }, 300);

  if (loading && !prestamos.length) {
    return <div>Cargando...</div>;
  }

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
          {filteredPrestamos.length > 0 ? (
            filteredPrestamos.map((prestamo, index) => (
              <CSSTransition key={prestamo.id} timeout={500} classNames="card-transition">
                <PrestamoCard
                  prestamo={prestamo}
                  onVerDetalles={handleVerDetalles} // Pasamos la función para ver detalles
                  onAprobar={() => fetchPrestamos(currentPage)} // Recargar préstamos tras aprobar
                />
              </CSSTransition>
            ))
          ) : (
            <p></p>
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

      {/* Modal de Detalles */}
      <DetallesPrestamoModal
        prestamoId={selectedPrestamoId}
        show={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Solicitados;

