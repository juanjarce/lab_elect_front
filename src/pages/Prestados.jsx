import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';
import PrestamoCardEntregado from './PrestamoCardEntregado'; // Nueva importación
import DetallesPrestamoForm from './DetallesPrestamoForm'; // Importar el formulario de detalles
import { debounce } from 'lodash';

const Prestados = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [filteredPrestamos, setFilteredPrestamos] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrestamoId, setSelectedPrestamoId] = useState(null);

  // Cargar los préstamos en estado PRESTADO
  const fetchPrestamos = async (page = 0) => {
    setLoading(true);
    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token'); 
      console.log(token);
  
      // Verificar si el token existe
      if (!token) {
        console.error('Token no encontrado');
        return;
      }
      
      const response = await axios.get(`http://localhost:8081/api/admin/prestamos/prestados?page=${page}&size=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
        }
      );
      if (response.data.status === 'Exito') {
        const prestamosWithNames = await Promise.all(
          response.data.data.content.map(async (prestamo) => {
            try {
              const estudianteResponse = await axios.get(
                `http://localhost:8081/api/admin/estudiante/nombre?id=${prestamo.idEstudiante}`
              );
              return { ...prestamo, nombreEstudiante: estudianteResponse.data.data.nombre };
            } catch {
              return { ...prestamo, nombreEstudiante: 'Nombre no disponible' };
            }
          })
        );
        setPrestamos(prestamosWithNames);
        setFilteredPrestamos(prestamosWithNames);
        setTotalPages(response.data.data.totalPages);
      } else {
        setError('No hay préstamos en estado PRESTADO.');
      }
    } catch (err) {
      setError('Error al cargar los préstamos en estado PRESTADO.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestamos(currentPage);
  }, [currentPage]);

  // Manejar la entrega del préstamo
  const handleEntregaPrestamo = async (idPrestamo) => {
    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token'); 
      console.log(token);
  
      // Verificar si el token existe
      if (!token) {
        console.error('Token no encontrado');
        return;
      }
      
      const response = await axios.put(`http://localhost:8081/api/admin/prestamos/devolver/${idPrestamo}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
        }
      );
      alert(response.data.message || 'Préstamo entregado con éxito.');
      fetchPrestamos(currentPage); // Recargar la lista tras entregar
    } catch (err) {
      alert(`${err.response?.data?.message}`);
    }
  };

  // Función para manejar la vista de detalles
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
    if (value === '') {
      setFilteredPrestamos(prestamos);
    } else {
      const lowercasedSearch = value.toLowerCase();
      const filtered = prestamos.filter(
        (prestamo) =>
          prestamo.id.toString().includes(lowercasedSearch) ||
          prestamo.nombreEstudiante?.toLowerCase().includes(lowercasedSearch)
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
      <h3>Préstamos Prestados</h3>

      <Form className="mb-4">
        <Row>
          <Col xs={12}>
            <Form.Control
              type="text"
              placeholder="Buscar por ID o Estudiante"
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-100"
            />
          </Col>
        </Row>
      </Form>

      <div className="row">
        {filteredPrestamos.length > 0 ? (
          filteredPrestamos.map((prestamo) => (
            <PrestamoCardEntregado
              key={prestamo.id}
              prestamo={prestamo}
              onVerDetalles={handleVerDetalles}
              onEntregar={handleEntregaPrestamo}
            />
          ))
        ) : (
          <p>No hay préstamos que coincidan con la búsqueda.</p>
        )}
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
      <DetallesPrestamoForm prestamoId={selectedPrestamoId} show={showModal} onClose={handleCloseModal} />
    </div>
  );
};

export default Prestados;

