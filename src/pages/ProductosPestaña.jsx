import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Form, Container, Pagination } from 'react-bootstrap';
import ProductoCard from './ProductoCard';
import ProductoDetalleModal from './ProductoDetalleModal';

const ProductosPestaña = () => {
  const { id } = useParams(); // Obtén el estudianteId desde la URL
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [cantidadDisponible, setCantidadDisponible] = useState({}); // Para almacenar la cantidad disponible de cada producto

  const pageSize = 10;

  useEffect(() => {
    cargarProductos(currentPage);
  }, [currentPage]);

  useEffect(() => {
    filtrarProductos();
  }, [searchTerm, productos]);

  // Función para cargar productos
  const cargarProductos = async (page) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/estudiantes/productos/paginated?page=${page}&size=${pageSize}`);
      const { content, totalPages } = response.data.data;
      setProductos(content);
      setTotalPages(totalPages);

      // Cargar la cantidad disponible para cada producto
      const cantidadDisponibles = {};
      for (const producto of content) {
        const cantidadResponse = await obtenerCantidadDisponible(producto.id);
        cantidadDisponibles[producto.id] = cantidadResponse;
      }
      setCantidadDisponible(cantidadDisponibles);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  // Función para obtener la cantidad disponible de un producto
  const obtenerCantidadDisponible = async (productoId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/estudiantes/productos/${productoId}/cantidad-disponible`);
      return response.data.data.cantDisponible;
    } catch (error) {
      console.error('Error al obtener la cantidad disponible:', error);
      return 0; // Si hay un error, devolvemos 0 como cantidad disponible
    }
  };

  // Función para filtrar los productos según el término de búsqueda
  const filtrarProductos = () => {
    const term = searchTerm.toLowerCase();
    const filtered = productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(term) ||
        producto.categoria.toLowerCase().includes(term)
    );
    setFilteredProductos(filtered);
  };

  const handleAgregarCarrito = async (productoId, cantidad) => {
    console.log(id);  // Asegúrate de que el id del estudiante se obtiene correctamente
    console.log(productoId);
  
    try {
      // Realiza la solicitud POST para agregar el producto al carrito
      await axios.post(`http://localhost:8081/api/estudiantes/producto/agregar/${id}/${productoId}?cantidad=${cantidad}`);
  
      // Actualizamos la cantidad disponible del producto en el estado
      setCantidadDisponible((prevCantidad) => ({
        ...prevCantidad,
        [productoId]: prevCantidad[productoId] - cantidad, // Reducimos la cantidad disponible
      }));
  
      // También actualizamos el estado de productos si es necesario
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto.id === productoId
            ? { ...producto, cantidad: prevCantidad[productoId] - cantidad }
            : producto
        )
      );
  
      alert('Producto agregado al carrito');
      window.location.reload(); // Recarga la página actual
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };
  

  return (
    <Container fluid>
      {/* Buscador */}
      <Form.Control
        type="text"
        placeholder="Buscar por nombre o categoría"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />

      {/* Lista de productos */}
      <Row>
        {filteredProductos.map((producto) => (
          <Col key={producto.id} md={3} sm={6} xs={12} className="mb-4">
            <ProductoCard
              producto={producto}
              onAgregarCarrito={handleAgregarCarrito}
              cantidadDisponible={cantidadDisponible[producto.id]} // Pasa la cantidad disponible al card
              onClick={() => setSelectedProducto(producto)}
            />
          </Col>
        ))}
      </Row>

      {/* Paginación */}
      <Pagination className="justify-content-center mt-3">
        {[...Array(totalPages).keys()].map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => setCurrentPage(page)}
          >
            {page + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Modal de detalles */}
      {selectedProducto && (
        <ProductoDetalleModal
          producto={selectedProducto}
          onClose={() => setSelectedProducto(null)}
        />
      )}
    </Container>
  );
};

export default ProductosPestaña;


