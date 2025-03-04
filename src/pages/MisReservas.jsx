import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
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
  const token = localStorage.getItem("token");

  /**
   * handles the reservation cancelation
   */
  const handleReservaCancelada = () => {
    setSelectedReserva(null);
    setReload((prev) => !prev);
  };

  /**
   * fetch the user reservations
   * */
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/estudiantes/reservas/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setReservas(response.data.data);
      } catch (err) {
        setError("Error al obtener las reservas");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [id, token, reload]);

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

