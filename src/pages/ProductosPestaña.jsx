import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Alert, Spinner, Container, Pagination, Form, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import { Filter, Search } from 'react-bootstrap-icons';
import ProductoCard from './ProductoCard';
import ProductoDetalleModal from './ProductoDetalleModal';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const ProductosPestaña = () => {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [searchNombre, setSearchNombre] = useState('');
  const [searchCategoria, setSearchCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const pageSize = 32;
  const paginationRef = useRef(null);

  useEffect(() => {
    cargarProductos(currentPage);
  }, [currentPage]);

  const cargarProductos = async (page) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token no encontrado.');
      return;
    }

    setCargando(true);
    try {
      const response = await axios.get(
        `http://localhost:8081/api/estudiantes/productos/filtrados?page=${page}&size=${pageSize}&nombre=${searchNombre}&categoria=${searchCategoria}&ubicacion=${ubicacion}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProductos(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      setError('Error al cargar los productos.');
    } finally {
      setCargando(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    cargarProductos(page);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    cargarProductos(0);
  };

  const scrollPagination = (direction) => {
    if (paginationRef.current) {
      const scrollAmount = 100;
      paginationRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Container fluid>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
          {successMessage}
        </Alert>
      )}

      <div className="d-flex align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre"
          value={searchNombre}
          onChange={(e) => setSearchNombre(e.target.value)}
          className="me-2"
        />
        <Form.Control
          type="text"
          placeholder="Buscar por categoría"
          value={searchCategoria}
          onChange={(e) => setSearchCategoria(e.target.value)}
          className="me-2"
        />
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={
            <Popover id="popover-filter">
              <Popover.Body>
                <Form.Select value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}>
                  <option value="">Todas las ubicaciones</option>
                  <option value="LABORATORIO_ELECTRÓNICA">Laboratorio Electrónica</option>
                  <option value="LABORATORIO_PROTOTIPADO">Laboratorio Prototipado</option>
                  <option value="LABORATORIO_TELEMÁTICA">Laboratorio Telemática</option>
                  <option value="BODEGA">Bodega</option>
                </Form.Select>
              </Popover.Body>
            </Popover>
          }
        >
          <Filter size={20} style={{ cursor: 'pointer' }} />
        </OverlayTrigger>
        <Button variant="light" className="ms-2" onClick={handleSearch}>
          <Search size={20} />
        </Button>
      </div>

      {cargando ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <TransitionGroup component={Row}>
          {productos.map((producto) => (
            <CSSTransition key={producto.id} timeout={300} classNames="fade">
              <Col md={3} sm={6} xs={12} className="mb-4">
                <ProductoCard producto={producto} onClick={() => setSelectedProducto(producto)} />
              </Col>
            </CSSTransition>
          ))}
        </TransitionGroup>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
        <button onClick={() => scrollPagination('left')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '5px' }}>◀</button>
        <div ref={paginationRef} style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '300px', padding: '5px' }}>
          <Pagination style={{ display: 'flex', flexWrap: 'nowrap' }}>
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
                {page + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
        <button onClick={() => scrollPagination('right')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '5px' }}>▶</button>
      </div>

      {selectedProducto && (
        <ProductoDetalleModal producto={selectedProducto} id={id} onClose={() => setSelectedProducto(null)} />
      )}
    </Container>
  );
};

export default ProductosPestaña;
