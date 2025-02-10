import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Pagination, Container, Form, Spinner, Modal } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './css/Laboratorios.css';
import ReservaFormulario from './ReservaFormulario';

const GestionReservas = () => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [filteredLaboratorios, setFilteredLaboratorios] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedLaboratorio, setSelectedLaboratorio] = useState(null);
  const [fecha, setFecha] = useState('');
  const [agendas, setAgendas] = useState([]);
  
  const pageSize = 100;

  useEffect(() => {
    cargarLaboratorios();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [searchTerm, laboratorios]);

  useEffect(() => {
    if (selectedLaboratorio && fecha) {
      cargarAgenda();
    }
  }, [fecha]);

  const cargarLaboratorios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        return;
      }

      const response = await axios.get('http://localhost:8081/api/admin/laboratorios/info', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLaboratorios(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / pageSize));
    } catch (error) {
      console.error('Error al cargar laboratorios:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarAgenda = async () => {
    if (!selectedLaboratorio || !fecha) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8081/api/admin/agenda/${selectedLaboratorio.id}/${fecha}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgendas(response.data.data || []);
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
    }
  };

  const aplicarFiltros = () => {
    const term = searchTerm.toLowerCase();
    const filtrados = laboratorios.filter(lab =>
      lab.nombre.toLowerCase().includes(term) ||
      lab.descripcion.toLowerCase().includes(term)
    );
    setFilteredLaboratorios(filtrados);
    setTotalPages(Math.ceil(filtrados.length / pageSize));
  };

  const handleOpenFormulario = (lab) => {
    setSelectedLaboratorio(lab);
    setShowModal(true);
  };

  const handleCloseFormulario = () => {
    setShowModal(false);
    setSelectedLaboratorio(null);
    setFecha('');
    setAgendas([]);
  };

  const laboratoriosPorPagina = filteredLaboratorios.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

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

      <Row>
        <TransitionGroup component={null}>
          {laboratoriosPorPagina.map(lab => (
            <CSSTransition key={lab.id} timeout={300} classNames="fade">
              <Col md={3} sm={6} xs={12} className="mb-3">
                <Card 
                  className="laboratorio-card fade-in" 
                  style={{ textAlign: 'center', padding: '10px', cursor: 'pointer' }} 
                  onClick={() => handleOpenFormulario(lab)}
                >
                  <Card.Img variant="top" src={`data:image/png;base64,${lab.imagen}`} alt={lab.nombre} style={{ height: '120px', objectFit: 'cover' }} />
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

      {loading && <div className="d-flex justify-content-center mt-3"><Spinner animation="border" /></div>}

      <ReservaFormulario show={showModal} onClose={handleCloseFormulario} laboratorio={selectedLaboratorio} />

    </Container>
  );
};

export default GestionReservas;

