import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col, Container, Form, Spinner, Button, Pagination, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./css/Laboratorios.css";
import ReservaFormulario from "./ReservaFormulario";

const GestionReservas = () => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedLaboratorio, setSelectedLaboratorio] = useState(null);
  const [fecha, setFecha] = useState("");
  const [agendas, setAgendas] = useState([]);

  const pageSize = 32;

  /**
   * handle the load of labs info
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
        `http://localhost:8081/api/admin/laboratorios/info?page=${currentPage}&size=${pageSize}&search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setLaboratorios(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Error al cargar laboratorios:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * handles the load of labs agenda
   * @returns
   */
  const cargarAgenda = async () => {
    if (!selectedLaboratorio || !fecha) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8081/api/admin/agenda/${selectedLaboratorio.id}/${fecha}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAgendas(response.data.data || []);
    } catch (error) {
      console.error("Error al obtener la agenda:", error);
    }
  };

  /**
   * handles the modal form
   * @param {*} lab
   */
  const handleOpenFormulario = (lab) => {
    setSelectedLaboratorio(lab);
    setShowModal(true);
  };

  /**
   * handles the modal form
   */
  const handleCloseFormulario = () => {
    setShowModal(false);
    setSelectedLaboratorio(null);
    setFecha("");
    setAgendas([]);
  };

  useEffect(() => {
    cargarLaboratorios(currentPage);
  }, [currentPage]);

  /**
  * handles the search of a product
  */
  const handleSearch = () => {
    setCurrentPage(0);
    cargarLaboratorios(0);
  };

  useEffect(() => {
    if (selectedLaboratorio && fecha) {
      cargarAgenda();
    }
  }, [fecha]);

  return (
    <Container fluid>
      <Form className="mb-4">
        <Row>
          <Col xs={12}>
           <InputGroup className="d-flex">
              <Form.Control
                type="text"
                placeholder="Buscar por Nombre del Laboratorio o Descripción"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
              <Button variant="primary" onClick={handleSearch}>
                <Search />
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="d-flex justify-content-center mt-3">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          <TransitionGroup component={null}>
            {laboratorios.map((lab) => (
              <CSSTransition key={lab.id} timeout={300} classNames="fade">
                <Col md={3} sm={6} xs={12} className="mb-3">
                  <Card
                    className="laboratorio-card fade-in"
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpenFormulario(lab)}
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
                    </Card.Body>
                  </Card>
                </Col>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </Row>
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

      <ReservaFormulario
        show={showModal}
        onClose={handleCloseFormulario}
        laboratorio={selectedLaboratorio}
      />
    </Container>
  );
};

export default GestionReservas;
