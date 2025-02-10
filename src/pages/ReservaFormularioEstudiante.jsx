import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import './css/ReservaFormulario.css';

const ReservaFormularioEstudiante = ({ show, onClose, laboratorio }) => {
    const { id } = useParams();
    const [fecha, setFecha] = useState('');
    const [agendas, setAgendas] = useState([]);
    const [mensaje, setMensaje] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingReserva, setLoadingReserva] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (fecha) {
            cargarAgenda();
        }
    }, [fecha]);

    const cargarAgenda = async () => {
        if (!laboratorio || !fecha) return;
        setLoading(true);
        try {
            const response = await axios.get(`https://labuq.catavento.co:10443/api/estudiantes/agenda/${id}/${laboratorio.id}/${fecha}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAgendas(response.data.data);
        } catch (error) {
            console.error('Error al obtener la agenda:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReservar = async (agendaId) => {
        const confirmacion = window.confirm("¿Está seguro de que quiere reservar en este espacio?");
        if (!confirmacion) return;
        console.log(id)
        console.log(agendaId)
        console.log(token)

        setLoadingReserva(true);
        try {
            const response = await axios.post('https://labuq.catavento.co:10443/api/estudiantes/reserva/reservar', {
                agendaId: agendaId,
                estudianteId: id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMensaje({ type: 'success', text: response.data.message });
        } catch (error) {
            setMensaje({ type: 'danger', text: error.response?.data?.message || 'Error al realizar la reserva' });
        } finally {
            setLoadingReserva(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Reservas - {laboratorio?.nombre}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {mensaje && <Alert variant={mensaje.type}>{mensaje.text}</Alert>}
                <Form>
                    <Form.Group controlId="fecha">
                        <Form.Label>Seleccionar Fecha</Form.Label>
                        <Form.Control 
                            type="date" 
                            value={fecha} 
                            onChange={(e) => setFecha(e.target.value)} 
                            style={{ backgroundColor: '#f8f9fa', border: '1px solid #ced4da', colorScheme: 'dark' }}
                        />
                    </Form.Group>
                </Form>

                <h5 className="mt-3">Horarios Disponibles</h5>
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                    </div>
                ) : agendas.length > 0 ? (
                    <div className="d-flex justify-content-center flex-wrap mt-3">
                        {agendas.map((agenda, index) => (
                            <Button 
                                key={index} 
                                variant="outline-primary" 
                                className="m-2 px-4 py-1" 
                                onClick={() => handleReservar(agenda.id)}
                                disabled={loadingReserva}
                            >
                                {loadingReserva ? <Spinner as="span" animation="border" size="sm" /> : `${agenda.horaInicio} - ${agenda.horaFin}`}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <p>No hay agenda creada para esta fecha.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReservaFormularioEstudiante;