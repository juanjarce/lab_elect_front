import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Form, Container, Pagination, OverlayTrigger, Popover, Alert } from 'react-bootstrap';
import { Filter } from 'react-bootstrap-icons';
import ProductoCard from './ProductoCard';
import ProductoDetalleModal from './ProductoDetalleModal';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './css/Transitions.css';

const ProductosPestaña = () => {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [cantidadDisponible, setCantidadDisponible] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const pageSize = 8;

  useEffect(() => {
    cargarProductos();
  }, []); // Cargar productos una vez al inicio

  useEffect(() => {
    filtrarProductos();
  }, [searchTerm, productos, ubicacion]); // Filtrar productos cada vez que cambian los criterios

  const cargarProductos = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token no encontrado.');
      return;
    }

    let allProducts = [];
    let totalProductPages = 0;
    
    try {
      // Realizar solicitudes por cada página de productos
      const response = await axios.get('https://labuq.catavento.co:10443/api/estudiantes/productos/paginated', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 0, size: pageSize }
      });

      totalProductPages = response.data.data.totalPages;

      for (let i = 0; i < totalProductPages; i++) {
        const pageResponse = await axios.get('https://labuq.catavento.co:10443/api/estudiantes/productos/paginated', {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: i, size: pageSize }
        });
        allProducts = allProducts.concat(pageResponse.data.data.content);
      }

      setProductos(allProducts);
      setTotalPages(Math.ceil(allProducts.length / pageSize));

      const cantidadDisponibles = {};
      for (const producto of allProducts) {
        const cantidadResponse = await obtenerCantidadDisponible(producto.id);
        cantidadDisponibles[producto.id] = cantidadResponse;
      }
      setCantidadDisponible(cantidadDisponibles);

    } catch (error) {
      setError('Error al cargar los productos.');
    }
  };

  const obtenerCantidadDisponible = async (productoId) => {
    try {
      const response = await axios.get(`https://labuq.catavento.co:10443/api/estudiantes/productos/${productoId}/cantidad-disponible`);
      return response.data.data.cantDisponible;
    } catch (error) {
      return 0;
    }
  };

  const filtrarProductos = () => {
    const term = searchTerm.toLowerCase();
    const filtered = productos.filter((producto) => {
      const matchesSearch = producto.nombre.toLowerCase().includes(term) || producto.categoria.toLowerCase().includes(term);
      const matchesUbicacion = ubicacion ? producto.ubicacion === ubicacion : true;
      return matchesSearch && matchesUbicacion;
    });
    setFilteredProductos(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize));
  };

  const handleAgregarCarrito = async (productoId, cantidad) => {
    setError(null);
    setSuccessMessage(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token no encontrado.');
      return;
    }

    try {
      await axios.post(`https://labuq.catavento.co:10443/api/estudiantes/producto/agregar/${id}/${productoId}?cantidad=${cantidad}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCantidadDisponible((prevCantidad) => ({
        ...prevCantidad,
        [productoId]: (prevCantidad[productoId] || 0) - cantidad,
      }));

      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto.id === productoId ? { ...producto, cantidad: 0 } : producto
        )
      );

      setSuccessMessage('Producto agregado al carrito con éxito.');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al agregar el producto al carrito.');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Solo mostrar los productos de la página actual
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

      <TransitionGroup component={Row}>
        {productosPaginaActual.map((producto) => (
          <CSSTransition key={producto.id} timeout={300} classNames="fade">
            <Col md={3} sm={6} xs={12} className="mb-4">
              <ProductoCard
                producto={producto}
                onAgregarCarrito={handleAgregarCarrito}
                cantidadDisponible={cantidadDisponible[producto.id]}
                onClick={() => setSelectedProducto(producto)}
              />
            </Col>
          </CSSTransition>
        ))}
      </TransitionGroup>

      <Pagination className="justify-content-center mt-3">
        {[...Array(totalPages).keys()].map((page) => (
          <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
            {page + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {selectedProducto && (
        <ProductoDetalleModal producto={selectedProducto} onClose={() => setSelectedProducto(null)} />
      )}
    </Container>
  );
};

export default ProductosPestaña;
