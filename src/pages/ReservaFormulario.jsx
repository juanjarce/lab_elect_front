import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import DetalleReservaFormulario from './DetalleReservaFormulario';
import './css/ReservaFormulario.css';

const ReservaFormulario = ({ show, onClose, laboratorio }) => {
    const [fecha, setFecha] = useState('');
    const [agendas, setAgendas] = useState([]);
    const [mensaje, setMensaje] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedAgenda, setSelectedAgenda] = useState(null);
    const [showDetalleReserva, setShowDetalleReserva] = useState(false);
    const [loadingCrear, setLoadingCrear] = useState(false);
    const [fechaNueva, setFechaNueva] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
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
            const response = await axios.get(`https://labuq.catavento.co:10443/api/admin/agenda/${laboratorio.id}/${fecha}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAgendas(response.data.data);
        } catch (error) {
            console.error('Error al obtener la agenda:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAgendaClick = (agenda) => {
        setSelectedAgenda(agenda);
        setShowDetalleReserva(true);
    };

    const handleCrearAgenda = async () => {
        if (!fechaNueva || !horaInicio || !horaFin) {
            setMensaje({ type: 'danger', text: 'Todos los campos son obligatorios' });
            return;
        }
        setLoadingCrear(true);
        setMensaje(null);
        try {
            const response = await axios.post('https://labuq.catavento.co:10443/api/admin/agenda/crear', {
                laboratorioId: laboratorio.id,
                fecha: fechaNueva,
                horaInicio,
                horaFin
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMensaje({ type: 'success', text: response.data.message });
            setFechaNueva('');
            setHoraInicio('');
            setHoraFin('');
        } catch (error) {
            setMensaje({ type: 'danger', text: 'Error al crear la agenda' });
        } finally {
            setLoadingCrear(false);
        }
    };

    const handleClose = () => {
        setFecha('');
        setAgendas([]);
        setMensaje(null);
        setSelectedAgenda(null);
        setShowDetalleReserva(false);
        setFechaNueva('');
        setHoraInicio('');
        setHoraFin('');
        onClose(); // Llama la función de cierre proporcionada por las props
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
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
                                onClick={() => handleAgendaClick(agenda)}
                            >
                                {agenda.horaInicio} - {agenda.horaFin}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <p>No hay agenda creada para esta fecha.</p>
                )}
                <hr />
                <h5 className="mt-3">Crear Nueva Agenda</h5>
                <Form>
                    <Form.Group controlId="fechaNueva">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control 
                            type="date" 
                            value={fechaNueva} 
                            onChange={(e) => setFechaNueva(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="horaInicio">
                        <Form.Label>Hora de Inicio</Form.Label>
                        <Form.Control 
                            type="time" 
                            value={horaInicio} 
                            onChange={(e) => setHoraInicio(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="horaFin">
                        <Form.Label>Hora de Fin</Form.Label>
                        <Form.Control 
                            type="time" 
                            value={horaFin} 
                            onChange={(e) => setHoraFin(e.target.value)}
                        />
                    </Form.Group>
                    <Button 
                        variant="success" 
                        className="mt-3 w-100"  // Agrega w-100 aquí
                        onClick={handleCrearAgenda} 
                        disabled={loadingCrear}
                    >
                        {loadingCrear ? <Spinner as="span" animation="border" size="sm" /> : 'Crear Agenda'}
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
            </Modal.Footer>
            <DetalleReservaFormulario 
                show={showDetalleReserva} 
                onClose={() => setShowDetalleReserva(false)} 
                agenda={selectedAgenda} 
            />
        </Modal>
    );
};

export default ReservaFormulario;