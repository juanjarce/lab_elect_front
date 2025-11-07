import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const DetalleReservaFormulario = ({ show, onClose, agenda }) => {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  /**
   * handle the load of all the details in a reservation
   * @returns
   */
  const cargarDetalles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://labuq.catavento.co:10443/api/admin/agenda/${agenda.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.data || !response.data.data) {
        setDetalles([]);
        return;
      }
      const detallesData = response.data.data;
      if (detallesData.length === 0) {
        setDetalles([]);
        return;
      }
      const detallesConNombres = await Promise.all(
        detallesData.map(async (detalle) => {
          try {
            const estudianteResponse = await axios.get(
              `https://labuq.catavento.co:10443/api/admin/estudiante/info?id=${detalle.estudianteId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            return {
              ...detalle,
              nombre: estudianteResponse.data.data.nombre || "Desconocido",
            };
          } catch (error) {
            console.log(error);
            return { ...detalle, nombre: "Desconocido" };
          }
        }),
      );
      setDetalles(detallesConNombres);
    } catch (error) {
      setDetalles([]);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * load all the details everytime the show happends
   * */
  useEffect(() => {
    if (show && agenda.id) {
      cargarDetalles();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : detalles.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Estudiante</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle) => (
                <tr key={detalle.id}>
                  <td>{detalle.id}</td>
                  <td>{detalle.nombre}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">No hay reservas en esta agenda.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetalleReservaFormulario;

