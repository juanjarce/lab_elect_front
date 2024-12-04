import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Pagination, Container, Form } from 'react-bootstrap';
import AgregarProductoForm from './AgregarProductoForm';
import ModificarProductoForm from './ModificarProductoForm';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]); // Estado para productos filtrados
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showModificarModal, setShowModificarModal] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);

  // Estados para búsqueda y filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUbicacion, setSelectedUbicacion] = useState('');

  const pageSize = 10;

  useEffect(() => {
    cargarProductos(currentPage);
  }, [currentPage]);

  useEffect(() => {
    aplicarFiltros();
  }, [searchTerm, selectedUbicacion, productos]);

  const cargarProductos = async (page) => {
    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token'); 
      console.log(token);
  
      // Verificar si el token existe
      if (!token) {
        console.error('Token no encontrado');
        return;
      }

      const response = await axios.get(
        `http://localhost:8081/api/admin/productos/paginated?page=${page}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
        }
      );
      const { content, totalPages } = response.data.data;
      setProductos(content);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const aplicarFiltros = () => {
    const term = searchTerm.toLowerCase();
    const filtrados = productos.filter((producto) => {
      const cumpleBusqueda =
        producto.nombre.toLowerCase().includes(term) ||
        producto.categoria.toLowerCase().includes(term) ||
        producto.id.toString().includes(term) ||
        (producto.codigoActivosFijos && producto.codigoActivosFijos.toLowerCase().includes(term)) ||
        (producto.responsable && producto.responsable.toLowerCase().includes(term));

      const cumpleUbicacion =
        !selectedUbicacion || producto.ubicacion === selectedUbicacion;

      return cumpleBusqueda && cumpleUbicacion;
    });

    setFilteredProductos(filtrados);
  };

  const eliminarProducto = async (idProducto) => {
    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token'); 
      console.log(token);
  
      // Verificar si el token existe
      if (!token) {
        console.error('Token no encontrado');
        return;
      }
      
      await axios.delete(`http://localhost:8081/api/admin/productos/eliminar/${idProducto}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
        }
      );
      setProductos(productos.filter((producto) => producto.id !== idProducto));
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Hubo un error al eliminar el producto.');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditar = (producto) => {
    setProductoAEditar(producto);
    setShowModificarModal(true);
  };

  return (
    <Container fluid>
      {/* Buscador y filtro */}
      <Row className="mb-3 align-items-center">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, categoría, ID, código o responsable"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedUbicacion}
            onChange={(e) => setSelectedUbicacion(e.target.value)}
          >
            <option value="">Todas las ubicaciones</option>
            <option value="LABORATORIO_ELECTRÓNICA">Laboratorio Electrónica</option>
            <option value="LABORATORIO_PROTOTIPADO">Laboratorio Prototipado</option>
            <option value="LABORATORIO_TELEMÁTICA">Laboratorio Telemática</option>
            <option value="BODEGA">Bodega</option>
          </Form.Select>
        </Col>
      </Row>

      <Button
        variant="success"
        className="mb-3"
        onClick={() => setShowAgregarModal(true)}
      >
        <i className="fas fa-plus"></i> Agregar Producto
      </Button>

      <Row>
        {filteredProductos.map((producto) => (
          <Col key={producto.id} md={3} sm={6} xs={12} className="mb-3">
            <Card style={{ height: '100%', textAlign: 'center', padding: '10px' }}>
              <Card.Img
                variant="top"
                src={`data:image/png;base64,${producto.imagen}`}
                alt={producto.nombre}
                style={{ height: '120px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title style={{ fontSize: '16px', fontWeight: 'bold' }}>{producto.nombre}</Card.Title>
                <Card.Text style={{ fontSize: '14px', margin: '5px 0', color: '#6c757d' }}>
                  {producto.descripcion}
                </Card.Text>
                <Card.Text style={{ fontSize: '14px', margin: '5px 0' }}>
                  Cantidad: {producto.cantidad}
                </Card.Text>
                <Card.Text style={{ fontSize: '13px', color: 'gray' }}>
                  Código: {producto.codigoActivosFijos || 'N/A'}
                </Card.Text>
                <Card.Text style={{ fontSize: '14px', margin: '5px 0', color: '#28a745' }}>
                  Ubicación: {producto.ubicacion.replace('_', ' ')}
                </Card.Text>
                <Card.Text style={{ fontSize: '14px', margin: '5px 0', color: '#dc3545' }}>
                  Responsable: {producto.responsable}
                </Card.Text>
                <Card.Text style={{ fontSize: '12px', color: '#007bff' }}>
                  ID Producto: {producto.id}
                </Card.Text>
                <Button variant="warning" onClick={() => handleEditar(producto)} className="mr-2">
                  <i className="fas fa-edit"></i> Editar
                </Button>
                <Button variant="danger" onClick={() => eliminarProducto(producto.id)}>
                  <i className="fas fa-trash"></i> Eliminar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination className="justify-content-center mt-3">
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

      <AgregarProductoForm
        show={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onSave={(nuevoProducto) => {
          setShowAgregarModal(false);
          cargarProductos(currentPage); // Recargar la lista
        }}
      />

      <ModificarProductoForm
        show={showModificarModal}
        onClose={() => setShowModificarModal(false)}
        onSave={() => {
          setShowModificarModal(false);
          cargarProductos(currentPage); // Recargar la lista
        }}
        producto={productoAEditar}
      />
    </Container>
  );
};

export default Productos;
