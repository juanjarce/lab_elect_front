import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Form, Container, OverlayTrigger, Popover, Alert, Spinner } from 'react-bootstrap';
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
  const [cantidadDisponible, setCantidadDisponible] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);  // Estado para el cargando

  const pageSize = 8;

  useEffect(() => {
    cargarProductos();  // Cargar todos los productos al inicio
  }, []);

  useEffect(() => {
    filtrarProductos();  // Aplicar filtros siempre que haya un cambio en los términos de búsqueda o los productos
  }, [searchTerm, productos, ubicacion]);

  const cargarProductos = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token no encontrado.');
      setLoading(false);  // Detenemos el loading si no hay token
      return;
    }

    try {
      let allProducts = [];
      let currentPage = 0;
      let totalPages = 1;  // Inicializamos en 1 para comenzar el ciclo

      // Hacer solicitudes para obtener todas las páginas de productos
      while (currentPage < totalPages) {
        const response = await axios.get(`https://labuq.catavento.co:10443/api/estudiantes/productos/paginated?page=${currentPage}&size=${pageSize}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { content, totalPages: newTotalPages } = response.data.data;
        allProducts = [...allProducts, ...content];
        totalPages = newTotalPages;  // Actualizamos la cantidad total de páginas
        currentPage++;
      }

      setProductos(allProducts);  // Guardamos todos los productos en el estado

      // Obtener la cantidad disponible para cada producto
      const cantidadDisponibles = {};
      for (const producto of allProducts) {
        const cantidadResponse = await obtenerCantidadDisponible(producto.id);
        cantidadDisponibles[producto.id] = cantidadResponse;
      }
      setCantidadDisponible(cantidadDisponibles);
      setLoading(false);  // Detenemos el loading cuando los productos están listos

    } catch (error) {
      setError('Error al cargar los productos.');
      setLoading(false);  // Detenemos el loading si hay error
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

      {loading ? (  // Mostrar el Spinner de carga mientras los productos están cargando
        <div className="d-flex justify-content-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
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
            {filteredProductos.map((producto) => (
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

          {selectedProducto && (
            <ProductoDetalleModal producto={selectedProducto} onClose={() => setSelectedProducto(null)} />
          )}
        </>
      )}
    </Container>
  );
};

export default ProductosPestaña;

