import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Pagination, Container, Form, Spinner, Modal } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import AgregarProductoForm from './AgregarProductoForm';
import ModificarProductoForm from './ModificarProductoForm';
import './css/Productos.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showModificarModal, setShowModificarModal] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // Estados para búsqueda y filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUbicacion, setSelectedUbicacion] = useState('');
  const [loading, setLoading] = useState(false);

  const pageSize = 32;

  const paginationRef = useRef(null); // Referencia para el contenedor de paginación

  useEffect(() => {
    cargarProductos(); // Cargar productos al cargar el componente
  }, []);

  useEffect(() => {
    aplicarFiltros(); // Aplicar filtros siempre que cambien los términos de búsqueda o productos
  }, [searchTerm, selectedUbicacion, productos]);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        return;
      }

      const response = await axios.get(
        `http://localhost:8081/api/admin/productos/paginated?page=0&size=999`, // Obtener todos los productos
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { content, totalPages } = response.data.data;
      setProductos(content);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    const term = searchTerm.toLowerCase();
    const filtrados = productos.filter((producto) => {
      const cumpleBusqueda =
        producto.nombre.toLowerCase().includes(term) ||
        producto.categoria.toLowerCase().includes(term) ||
        producto.id.toString().includes(term) ||
        (producto.codigoActivosFijos && producto.codigoActivosFijos.toLowerCase().includes(term)) ||
        (producto.responsable && producto.responsable.toLowerCase().includes(term));

      const cumpleUbicacion =
        !selectedUbicacion || producto.ubicacion === selectedUbicacion;

      return cumpleBusqueda && cumpleUbicacion;
    });

    setFilteredProductos(filtrados);
    setTotalPages(Math.ceil(filtrados.length / pageSize)); // Actualizar totalPages según los productos filtrados
  };

  const confirmarEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setShowConfirmModal(true);
  };

  const eliminarProducto = async () => {
    if (!productoAEliminar) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        return;
      }

      await axios.delete(
        `http://localhost:8081/api/admin/productos/eliminar/${productoAEliminar.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProductos(productos.filter((producto) => producto.id !== productoAEliminar.id));
      setShowConfirmModal(false);
      setProductoAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Hubo un error al eliminar el producto.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditar = (producto) => {
    setProductoAEditar(producto);
    setShowModificarModal(true);
  };

  const productosPorPagina = filteredProductos.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  // Función para desplazar la paginación
  const scrollPagination = (direction) => {
    if (paginationRef.current) {
      const scrollAmount = 100; // Cantidad de desplazamiento
      paginationRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Container fluid>
      <Row className="mb-3 align-items-center">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, categoría, ID, código o responsable"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedUbicacion}
            onChange={(e) => setSelectedUbicacion(e.target.value)}
          >
            <option value="">Todas las ubicaciones</option>
            <option value="LABORATORIO_ELECTRÓNICA">Laboratorio Electrónica</option>
            <option value="LABORATORIO_PROTOTIPADO">Laboratorio Prototipado</option>
            <option value="LABORATORIO_TELEMÁTICA">Laboratorio Telemática</option>
            <option value="BODEGA">Bodega</option>
          </Form.Select>
        </Col>
      </Row>

      <Button
        variant="success"
        className="mb-3"
        onClick={() => setShowAgregarModal(true)}
      >
        <i className="fas fa-plus"></i> Agregar Producto
      </Button>

      <Row>
        <TransitionGroup component={null}>
          {productosPorPagina.map((producto) => (
            <CSSTransition key={producto.id} timeout={300} classNames="fade">
              <Col md={3} sm={6} xs={12} className="mb-3">
                <Card
                  className="producto-card fade-in"
                  style={{
                    height: '100%',
                    textAlign: 'center',
                    padding: '10px',
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={`data:image/png;base64,${producto.imagen}`}
                    alt={producto.nombre}
                    style={{ height: '120px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title style={{ fontSize: '16px', fontWeight: 'bold' }}>
                      {producto.nombre}
                    </Card.Title>
                    <Card.Text style={{ fontSize: '14px', margin: '5px 0', color: '#6c757d' }}>
                      {producto.descripcion}
                    </Card.Text>
                    <Card.Text style={{ fontSize: '14px', margin: '5px 0' }}>
                      Cantidad: {producto.cantidad}
                    </Card.Text>
                    <Card.Text style={{ fontSize: '13px', color: 'gray' }}>
                      Código: {producto.codigoActivosFijos || 'N/A'}
                    </Card.Text>
                    <Card.Text style={{ fontSize: '14px', margin: '5px 0', color: '#28a745' }}>
                      Ubicación: {producto.ubicacion.replace('_', ' ')}
                    </Card.Text>
                    <Card.Text style={{ fontSize: '14px', margin: '5px 0', color: '#dc3545' }}>
                      Responsable: {producto.responsable}
                    </Card.Text>
                    <Card.Text style={{ fontSize: '12px', color: '#007bff' }}>
                      ID Producto: {producto.id}
                    </Card.Text>
                    <Button
                      variant="warning"
                      onClick={() => handleEditar(producto)}
                      className="mr-2"
                    >
                      <i className="fas fa-edit"></i> Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => confirmarEliminacion(producto)}
                    >
                      <i className="fas fa-trash"></i> Eliminar
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </Row>

      {loading && (
        <div className="d-flex justify-content-center mt-3">
          <Spinner animation="border" />
        </div>
      )}

      {/* Contenedor de la paginación con botones de desplazamiento */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
        {/* Botón izquierdo para desplazar */}
        <button
          onClick={() => scrollPagination('left')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '5px',
          }}
        >
          ◀
        </button>

        {/* Contenedor de paginación con scroll horizontal */}
        <div
          ref={paginationRef}
          style={{
            display: 'flex',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            maxWidth: '300px', // Puedes ajustar el tamaño
            padding: '5px',
          }}
        >
          <Pagination style={{ display: 'flex', flexWrap: 'nowrap' }}>
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>

        {/* Botón derecho para desplazar */}
        <button
          onClick={() => scrollPagination('right')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '5px',
          }}
        >
          ▶
        </button>
      </div>

      <AgregarProductoForm
        show={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onSave={(nuevoProducto) => {
          setShowAgregarModal(false);
          cargarProductos();
        }}
      />

      <ModificarProductoForm
        show={showModificarModal}
        onClose={() => setShowModificarModal(false)}
        onSave={() => {
          setShowModificarModal(false);
          cargarProductos();
        }}
        producto={productoAEditar}
      />

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar el producto "{productoAEliminar?.nombre}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarProducto}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Productos;
