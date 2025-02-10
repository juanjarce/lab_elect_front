import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';

const DetalleReservaEstudiante = ({ show, onHide, reserva, onReservaCancelada }) => {
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    if (!reserva) return null;

    const cancelarReserva = async () => {
        if (!window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) return;

        setLoading(true);

        try {
            await axios.delete(`https://labuq.catavento.co:10443/api/estudiantes/reserva/cancelar/${reserva.estudianteId}`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { detalleAgendaId: reserva.id } // 🔥 IMPORTANTE: `data` para enviar el body en DELETE
            });

            alert("Reserva cancelada exitosamente");
            onReservaCancelada(); // 🔥 Recargar reservas en `MisReservas.jsx`
            onHide(); // Cierra el modal
        } catch (error) {
            alert("Error al cancelar la reserva");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Detalles de la Reserva</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="id">
                        <Form.Label>ID</Form.Label>
                        <Form.Control type="text" value={reserva.id} disabled />
                    </Form.Group>

                    <Form.Group controlId="fecha">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control type="text" value={reserva.fecha} disabled />
                    </Form.Group>

                    <Form.Group controlId="horaInicio">
                        <Form.Label>Hora Inicio</Form.Label>
                        <Form.Control type="text" value={reserva.horaInicio} disabled />
                    </Form.Group>

                    <Form.Group controlId="horaFin">
                        <Form.Label>Hora Fin</Form.Label>
                        <Form.Control type="text" value={reserva.horaFin} disabled />
                    </Form.Group>

                    <Form.Group controlId="laboratorio">
                        <Form.Label>Laboratorio</Form.Label>
                        <Form.Control type="text" value={reserva.laboratorio} disabled />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" className="w-100" onClick={cancelarReserva} disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Cancelar Reserva"}
                </Button>
                <Button variant="secondary" onClick={onHide}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DetalleReservaEstudiante;


