import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Pagination, Container } from 'react-bootstrap';
import AgregarProductoForm from './AgregarProductoForm';
import ModificarProductoForm from './ModificarProductoForm';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showModificarModal, setShowModificarModal] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);

  const pageSize = 10;

  useEffect(() => {
    cargarProductos(currentPage);
  }, [currentPage]);

  const cargarProductos = async (page) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/admin/productos/paginated?page=${page}&size=${pageSize}`);
      const { content, totalPages } = response.data.data;
      setProductos(content);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const agregarProducto = async (nuevoProducto) => {
    try {
      await axios.post('http://localhost:8081/api/admin/productos/agregar', nuevoProducto, {
        headers: { 'Content-Type': 'application/json' },
      });
      setShowAgregarModal(false);
      cargarProductos(currentPage); // Recargar la lista
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  const eliminarProducto = async (idProducto) => {
    try {
      await axios.delete(`http://localhost:8081/api/admin/productos/eliminar/${idProducto}`);
      setProductos(productos.filter(producto => producto.id !== idProducto)); // Filtra el producto eliminado
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Hubo un error al eliminar el producto.');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditar = (producto) => {
    setProductoAEditar(producto); // Guardar el producto para editarlo
    setShowModificarModal(true);  // Mostrar el modal de modificación
  };

  return (
    <Container fluid>
      <Button
        variant="success"
        className="mb-3"
        onClick={() => setShowAgregarModal(true)}
      >
        <i className="fas fa-plus"></i> Agregar Producto
      </Button>

      <Row>
        {productos.map((producto) => (
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
                
                {/* Mostrar el idProducto en la card */}
                <Card.Text style={{ fontSize: '12px', color: '#007bff' }}>
                  ID Producto: {producto.id}
                </Card.Text>

                {/* Botones de edición y eliminación */}
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

      {/* Barra de paginación */}
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
        onSave={agregarProducto}
      />

      {/* Modal para editar producto */}
      <ModificarProductoForm
        show={showModificarModal}
        onClose={() => setShowModificarModal(false)}
        onSave={(productoEditado) => {
          setShowModificarModal(false);
          cargarProductos(currentPage); // Recargar la lista después de editar
        }}
        producto={productoAEditar} // Pasamos el producto a editar
      />
    </Container>
  );
};

export default Productos;











