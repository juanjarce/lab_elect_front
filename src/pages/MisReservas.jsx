import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Spinner, Alert, Container, Row, Col, Pagination } from "react-bootstrap";
import { useParams } from "react-router-dom";
import DetalleReservaEstudiante from "./DetalleReservaEstudiante";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./css/MisReservas.css"; // Archivo de estilos para las animaciones

const MisReservas = () => {
  const { id } = useParams();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [reload, setReload] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem("token");

  const pageSize = 32;

  /**
   * handles the reservation cancelation
   */
  const handleReservaCancelada = () => {
    setSelectedReserva(null);
    setReload((prev) => !prev);
  };

  useEffect(() => {
    cargarReservas(currentPage);
  }, [currentPage, reload]);

  const cargarReservas = async (page) => {
    setLoading(true);
    setError(null); // Reiniciar el error antes de la petición
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      const response = await axios.get(
        `http://localhost:8081/api/estudiantes/reservas/${id}?page=${currentPage}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const data = response.data.data.content;
      
      if (Array.isArray(data)) {
        setReservas(data);
        setTotalPages(response.data.data.totalPages);
      } else {
        setReservas([]); // Si la respuesta no es válida, aseguramos que reservas sea un array vacío
      }
    } catch (error) {
      console.error("Error al cargar las reservas:", error);
      setError("Ocurrió un error al cargar las reservas."); // Mensaje de error claro
    } finally {
      setLoading(false);
    }
  };  

  const handlePageChange = (page) => {
    setCurrentPage(page); // Cambiar la página
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-start">Mis Reservas</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : reservas.length === 0 ? (
        <Alert variant="info">No tienes reservas registradas.</Alert>
      ) : (
        <TransitionGroup component={Row} className="g-3">
          {reservas.map((reserva) => (
            <CSSTransition key={reserva.id} timeout={300} classNames="fade">
              <Col md={4}>
                <Card
                  className="reserva-card"
                  onClick={() => setSelectedReserva(reserva)}
                >
                  <Card.Body>
                    <Card.Title>ID: {reserva.id}</Card.Title>
                    <Card.Text>
                      <strong>Fecha:</strong> {reserva.fecha} <br />
                      <strong>Hora Inicio:</strong> {reserva.horaInicio} <br />
                      <strong>Hora Fin:</strong> {reserva.horaFin} <br />
                      <strong>Laboratorio:</strong> {reserva.laboratorio}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </CSSTransition>
          ))}
        </TransitionGroup>
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

      <DetalleReservaEstudiante
        show={selectedReserva !== null}
        onHide={() => setSelectedReserva(null)}
        reserva={selectedReserva}
        onReservaCancelada={handleReservaCancelada}
      />
    </Container>
  );
};

export default MisReservas;

