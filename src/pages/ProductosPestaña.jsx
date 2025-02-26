import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Row,
  Col,
  Form,
  Container,
  Pagination,
  OverlayTrigger,
  Popover,
  Alert,
} from "react-bootstrap";
import { Filter } from "react-bootstrap-icons";
import ProductoCard from "./ProductoCard";
import ProductoDetalleModal from "./ProductoDetalleModal";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Spinner } from "react-bootstrap";

const ProductosPestaña = () => {
  const { id } = useParams();
  const [productos, setProductos] = useState([]); // Acumula los productos ya cargados
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [cantidadDisponible, setCantidadDisponible] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [cargando, setCargando] = useState(true);

  const pageSize = 32;
  const paginationRef = useRef(null);

  // carga la primera pagina
  useEffect(() => {
    cargarProductos();
  }, []);

  // al cambiar el termino de busqueda, se filtra sobre los productos
  useEffect(() => {
    filtrarProductos();
  }, [searchTerm, productos, ubicacion]);

  /**
   * Carga los productos de manera acumulada
   * @returns los productos cargados / acumulados
   */
  const cargarProductos = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token no encontrado.");
      return;
    }

    setCargando(true);

    try {
      const response = await axios.get(
        "https://labuq.catavento.co:10443/api/estudiantes/productos/todos?page=${page}&size=${pageSize}",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const nuevosProductos = response.data.data;
      if (page === 0) {
        setProductos(nuevosProductos);
      } else {
        setProductos((prev) => [...prev, ...nuevosProductos]);
      }
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError("Error al cargar los productos.");
    } finally {
      setCargando(false);
    }
  };

  /**
   * Funcion para filtrar sobre los productos ya cargados
   */
  const filtrarProductos = () => {
    const term = searchTerm.toLowerCase();
    const filtered = productos.filter((producto) => {
      const matchesSearch =
        producto.nombre.toLowerCase().includes(term) ||
        producto.categoria.toLowerCase().includes(term);
      const matchesUbicacion = ubicacion
        ? producto.ubicacion === ubicacion
        : true;
      return matchesSearch && matchesUbicacion;
    });
    setFilteredProductos(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize));
  };

  /**
   * Maneja el cambio de pagina para la paginacion acumulativa
   * @param {*} page la pagina a cambiar
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    cargarProductos(page);
  };

  const scrollPagination = (direction) => {
    if (paginationRef.current) {
      const scrollAmount = 100;
      paginationRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const productosPaginaActual = filteredProductos.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  return (
    <Container fluid>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert
          variant="success"
          onClose={() => setSuccessMessage(null)}
          dismissible
        >
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
                  <option value="LABORATORIO_ELECTRÓNICA">
                    Laboratorio Electrónica
                  </option>
                  <option value="LABORATORIO_PROTOTIPADO">
                    Laboratorio Prototipado
                  </option>
                  <option value="LABORATORIO_TELEMÁTICA">
                    Laboratorio Telemática
                  </option>
                  <option value="BODEGA">Bodega</option>
                </Form.Control>
              </Popover.Body>
            </Popover>
          }
        >
          <Filter size={20} style={{ cursor: "pointer" }} />
        </OverlayTrigger>
      </div>

      {cargando ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        <button
          onClick={() => scrollPagination("left")}
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            padding: "5px",
          }}
        >
          ◀
        </button>
        <div
          ref={paginationRef}
          style={{
            display: "flex",
            overflowX: "auto",
            whiteSpace: "nowrap",
            maxWidth: "300px",
            padding: "5px",
          }}
        >
          <Pagination style={{ display: "flex", flexWrap: "nowrap" }}>
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
        <button
          onClick={() => scrollPagination("right")}
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            padding: "5px",
          }}
        >
          ▶
        </button>
      </div>

      {selectedProducto && (
        <ProductoDetalleModal
          producto={selectedProducto}
          id={id}
          onClose={() => setSelectedProducto(null)}
        />
      )}
    </Container>
  );
};

export default ProductosPestaña;
