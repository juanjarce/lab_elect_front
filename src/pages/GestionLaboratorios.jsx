import { useState, useEffect } from "react";
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
} from "react-bootstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import AgregarLaboratorioForm from "./AgregarLaboratorioForm";
import ModificarLaboratorioForm from "./ModificarLaboratorioForm";
import "./css/Laboratorios.css";

const GestionLaboratorios = () => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [filteredLaboratorios, setFilteredLaboratorios] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showModificarModal, setShowModificarModal] = useState(false);
  const [laboratorioAEditar, setLaboratorioAEditar] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [laboratorioAEliminar, setLaboratorioAEliminar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const pageSize = 100;

  /**
   * handle the load of laboratories info
   * @returns
   */
  const cargarLaboratorios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      const response = await axios.get(
        "http://localhost:8081/api/admin/laboratorios/info",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLaboratorios(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / pageSize));
    } catch (error) {
      console.error("Error al cargar laboratorios:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * handles the filters for searching labs
   */
  const aplicarFiltros = () => {
    const term = searchTerm.toLowerCase();
    const filtrados = laboratorios.filter(
      (lab) =>
        lab.nombre.toLowerCase().includes(term) ||
        lab.descripcion.toLowerCase().includes(term),
    );
    setFilteredLaboratorios(filtrados);
    setTotalPages(Math.ceil(filtrados.length / pageSize));
  };

  /**
   * handles the modal to delete a lab
   * @param {*} lab
   */
  const confirmarEliminacion = (lab) => {
    setLaboratorioAEliminar(lab);
    setShowConfirmModal(true);
  };

  /**
   * handles the function to delete a lab
   * @returns
   */
  const eliminarLaboratorio = async () => {
    if (!laboratorioAEliminar) return;
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:8081/api/admin/laboratorios/eliminar/${laboratorioAEliminar.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLaboratorios((prevLaboratorios) =>
        prevLaboratorios.filter((lab) => lab.id !== laboratorioAEliminar.id),
      );
      setShowConfirmModal(false);
      setLaboratorioAEliminar(null);
      console.log(
        `Laboratorio con ID ${laboratorioAEliminar.id} eliminado correctamente.`,
      );
    } catch (error) {
      console.error("Error al eliminar el laboratorio:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * handle the pagination
   * @param {*} page
   * @returns
   */
  const handlePageChange = (page) => setCurrentPage(page);

  /**
   * handle the modal to edit a lab
   * @param {*} lab
   */
  const handleEditar = (lab) => {
    setLaboratorioAEditar(lab);
    setShowModificarModal(true);
  };

  const laboratoriosPorPagina = filteredLaboratorios.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  useEffect(() => {
    cargarLaboratorios();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [searchTerm, laboratorios]);

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col md={12}>
          <Form.Control
            type="text"
            placeholder="Buscar laboratorio"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      <Button
        variant="success"
        className="mb-3"
        onClick={() => setShowAgregarModal(true)}
      >
        <i className="fas fa-plus"></i> Agregar Laboratorio
      </Button>

      <Row>
        <TransitionGroup component={null}>
          {laboratoriosPorPagina.map((lab) => (
            <CSSTransition key={lab.id} timeout={300} classNames="fade">
              <Col md={3} sm={6} xs={12} className="mb-3">
                <Card
                  className="laboratorio-card fade-in"
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  <Card.Img
                    variant="top"
                    src={`data:image/png;base64,${lab.imagen}`}
                    alt={lab.nombre}
                    style={{ height: "120px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{lab.nombre}</Card.Title>
                    <Card.Text>{lab.descripcion}</Card.Text>
                    <Card.Text>Capacidad: {lab.capacidad}</Card.Text>
                    <Button
                      variant="warning"
                      onClick={() => handleEditar(lab)}
                      className="mr-2"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => confirmarEliminacion(lab)}
                    >
                      Eliminar
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

      <div className="d-flex justify-content-center mt-3">
        <Pagination>
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

      <AgregarLaboratorioForm
        show={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onSave={cargarLaboratorios}
      />
      <ModificarLaboratorioForm
        show={showModificarModal}
        onClose={() => setShowModificarModal(false)}
        onSave={cargarLaboratorios}
        laboratorio={laboratorioAEditar}
      />

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar el laboratorio "
          {laboratorioAEliminar?.nombre}"?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarLaboratorio}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionLaboratorios;

