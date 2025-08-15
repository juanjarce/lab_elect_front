import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Row,
  Col,
  Pagination,
  Container,
  Form,
  Spinner,
  Modal,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import AgregarProductoForm from "./AgregarProductoForm";
import { Filter, Search } from "react-bootstrap-icons";
import ModificarProductoForm from "./ModificarProductoForm";
import "./css/Productos.css";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showModificarModal, setShowModificarModal] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [searchNombre, setSearchNombre] = useState("");
  const [searchCategoria, setSearchCategoria] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [loading, setLoading] = useState(false);

  const pageSize = 32;

  const paginationRef = useRef(null);

  useEffect(() => {
    cargarProductos(currentPage);
  }, [currentPage]);

  /**
   * handles all the products load
   * @returns
   */
  const cargarProductos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      const response = await axios.get(
        `http://localhost:8081/api/admin/productos/filtrados?page=${currentPage}&size=${pageSize}&nombre=${searchNombre}&categoria=${searchCategoria}&ubicacion=${ubicacion}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setProductos(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * handles the confirm elimination of a product
   * @param {*} producto
   */
  const confirmarEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setShowConfirmModal(true);
  };

  /**
   * handles the delete product functionality
   * @returns
   */
  const eliminarProducto = async () => {
    if (!productoAEliminar) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      await axios.delete(
        `http://localhost:8081/api/admin/productos/eliminar/${productoAEliminar.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setProductos(
        productos.filter((producto) => producto.id !== productoAEliminar.id),
      );
      setShowConfirmModal(false);
      setProductoAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Hubo un error al eliminar el producto.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * handles the pagination change
   * @param {*} page
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /**
   * handles the search of a product
   */
  const handleSearch = () => {
    setCurrentPage(0);
    cargarProductos(0);
  };

  /**
   * handles the update of a product
   * @param {*} producto
   */
  const handleEditar = (producto) => {
    setProductoAEditar(producto);
    setShowModificarModal(true);
  };

  /**
   * handles the scroll pagination
   * @param {*} direction
   */
  const scrollPagination = (direction) => {
    if (paginationRef.current) {
      const scrollAmount = 100; // Cantidad de desplazamiento
      paginationRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Container fluid>
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
                <Form.Select
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
                </Form.Select>
              </Popover.Body>
            </Popover>
          }
        >
          <Filter size={20} style={{ cursor: "pointer" }} />
        </OverlayTrigger>
        <Button variant="light" className="ms-2" onClick={handleSearch}>
          <Search size={20} />
        </Button>
      </div>

      <Button
        variant="success"
        className="mb-3"
        onClick={() => setShowAgregarModal(true)}
      >
        <i className="fas fa-plus"></i> Agregar Producto
      </Button>

      {loading ? (
        <div className="d-flex justify-content-center mt-3">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          <TransitionGroup component={null}>
            {productos.map((producto) => (
              <CSSTransition key={producto.id} timeout={300} classNames="fade">
                <Col md={3} sm={6} xs={12} className="mb-3">
                  <Card
                    className="producto-card fade-in"
                    style={{
                      height: "100%",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={`data:image/png;base64,${producto.imagen}`}
                      alt={producto.nombre}
                      style={{ height: "120px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title style={{ fontSize: "16px", fontWeight: "bold" }}>
                        {producto.nombre}
                      </Card.Title>
                      <Card.Text
                        style={{
                          fontSize: "14px",
                          margin: "5px 0",
                          color: "#6c757d",
                        }}
                      >
                        {producto.descripcion}
                      </Card.Text>
                      <Card.Text style={{ fontSize: "14px", margin: "5px 0" }}>
                        Cantidad: {producto.cantidad}
                      </Card.Text>
                      <Card.Text style={{ fontSize: "13px", color: "gray" }}>
                        Código: {producto.codigoActivosFijos || "N/A"}
                      </Card.Text>
                      <Card.Text
                        style={{
                          fontSize: "14px",
                          margin: "5px 0",
                          color: "#28a745",
                        }}
                      >
                        Ubicación: {producto.ubicacion.replace("_", " ")}
                      </Card.Text>
                      <Card.Text
                        style={{
                          fontSize: "14px",
                          margin: "5px 0",
                          color: "#dc3545",
                        }}
                      >
                        Responsable: {producto.responsable}
                      </Card.Text>
                      <Card.Text style={{ fontSize: "12px", color: "#007bff" }}>
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
            maxWidth: "300px", // Puedes ajustar el tamaño
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
          ¿Estás seguro de que deseas eliminar el producto "
          {productoAEliminar?.nombre}"?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
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
