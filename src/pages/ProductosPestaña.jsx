import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Form, Container, Pagination, OverlayTrigger, Popover, Alert, Spinner } from 'react-bootstrap';
import { Filter } from 'react-bootstrap-icons';
import ProductoCard from './ProductoCard';
import ProductoDetalleModal from './ProductoDetalleModal';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const ProductosPestaña = () => {
  const { id } = useParams();
  const [productos, setProductos] = useState([]); // Acumula los productos ya cargados
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [cantidadDisponible, setCantidadDisponible] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [cargando, setCargando] = useState(true);

  const pageSize = 32;
  const paginationRef = useRef(null);

  // Al montar, cargar la primera página
  useEffect(() => {
    cargarProductos(0);
  }, []);

  // Al cambiar el término de búsqueda o ubicación, filtrar sobre todos los productos ya cargados
  useEffect(() => {
    filtrarProductos();
  }, [searchTerm, productos, ubicacion]);

  // Función modificada: acumula productos (si currentPage es 0, reemplaza; si no, acumula)
  const cargarProductos = async (page) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token no encontrado.');
      return;
    }
  
    setCargando(true);
  
    try {
      const response = await axios.get(
        `https://labuq.catavento.co:10443/api/estudiantes/productos/todos?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const nuevosProductos = response.data.data;
      // Si es la primera página, reemplazamos; en las siguientes, acumulamos sin duplicar
      if (page === 0) {
        setProductos(nuevosProductos);
      } else {
        setProductos((prev) => {
          // Filtrar nuevosProductos que ya no estén en prev (comparando por id)
          const nuevosSinDuplicados = nuevosProductos.filter(np => 
            !prev.some(p => p.id === np.id)
          );
          return [...prev, ...nuevosSinDuplicados];
        });
      }
      // Se espera que el backend retorne totalPages
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError('Error al cargar los productos.');
    } finally {
      setCargando(false);
    }
  };

  // Filtrar sobre los productos ya cargados
  const filtrarProductos = () => {
    const term = searchTerm.toLowerCase();
    const filtered = productos.filter((producto) => {
      const matchesSearch = producto.nombre.toLowerCase().includes(term) || producto.categoria.toLowerCase().includes(term);
      const matchesUbicacion = ubicacion ? producto.ubicacion === ubicacion : true;
      return matchesSearch && matchesUbicacion;
    });
    setFilteredProductos(filtered);
    // Total de páginas basado en la cantidad filtrada (si se quiere que la paginación filtre también, ajustar aquí)
    setTotalPages(Math.ceil(filtered.length / pageSize));
  };

  // Cambiar de página: para paginación acumulativa, simplemente cargar la siguiente página y actualizar currentPage
  const handlePageChange = (page) => {
    setCurrentPage(page);
    cargarProductos(page);
  };

  const scrollPagination = (direction) => {
    if (paginationRef.current) {
      const scrollAmount = 100;
      paginationRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Aquí, en lugar de mostrar productos de la página actual, usamos el filtrado global (filteredProductos)
  // Puedes ajustar si deseas paginar el resultado filtrado o no
  const productosPaginaActual = filteredProductos.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

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
          placeholder="Buscar por nombre o categoría"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="me-2"
        />
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={
            <Popover id="popover-filter">
              <Popover.Body>
                <Form.Control
                  as="select"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                >
                  <option value="">Todas las ubicaciones</option>
                  <option value="LABORATORIO_ELECTRÓNICA">Laboratorio Electrónica</option>
                  <option value="LABORATORIO_PROTOTIPADO">Laboratorio Prototipado</option>
                  <option value="LABORATORIO_TELEMÁTICA">Laboratorio Telemática</option>
                  <option value="BODEGA">Bodega</option>
                </Form.Control>
              </Popover.Body>
            </Popover>
          }
        >
          <Filter size={20} style={{ cursor: 'pointer' }} />
        </OverlayTrigger>
      </div>

      {cargando ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <TransitionGroup component={Row}>
          {productosPaginaActual.map((producto) => (
            <CSSTransition key={producto.id} timeout={300} classNames="fade">
              <Col md={3} sm={6} xs={12} className="mb-4">
                <ProductoCard
                  producto={producto}
                  onClick={() => setSelectedProducto(producto)}
                />
              </Col>
            </CSSTransition>
          ))}
        </TransitionGroup>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
        <button
          onClick={() => scrollPagination('left')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          ◀
        </button>
        <div
          ref={paginationRef}
          style={{
            display: 'flex',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            maxWidth: '300px',
            padding: '5px'
          }}
        >
          <Pagination style={{ display: 'flex', flexWrap: 'nowrap' }}>
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
                {page + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
        <button
          onClick={() => scrollPagination('right')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          ▶
        </button>
      </div>

      {selectedProducto && (
        <ProductoDetalleModal 
          producto={selectedProducto} 
          id={id} 
          onClose={() => setSelectedProducto(null)} />
      )}
    </Container>
  );
};

export default ProductosPestaña;