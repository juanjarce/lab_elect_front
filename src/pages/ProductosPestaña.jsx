import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Form, Container, Pagination, OverlayTrigger, Popover } from 'react-bootstrap';
import { Filter } from 'react-bootstrap-icons'; // Importamos el ícono de filtro
import ProductoCard from './ProductoCard';
import ProductoDetalleModal from './ProductoDetalleModal';

const ProductosPestaña = () => {
  const { id } = useParams(); // Obtén el estudianteId desde la URL
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ubicacion, setUbicacion] = useState(''); // Estado para la ubicación seleccionada
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
  }, [searchTerm, productos, ubicacion]); // Agregar ubicacion al array de dependencias

  // Función para cargar productos
  const cargarProductos = async (page) => {

    // Obtener el token del localStorage
    const token = localStorage.getItem('token'); // Asegúrate de que el nombre coincide con el nombre usado al guardar el token
    console.log(token);

    // Verificar si el token existe
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8081/api/estudiantes/productos/paginated?page=${page}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
        }
      );
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

  // Función para filtrar los productos según el término de búsqueda y la ubicación
  const filtrarProductos = () => {
    const term = searchTerm.toLowerCase();
    const filtered = productos.filter((producto) => {
      const matchesSearch = producto.nombre.toLowerCase().includes(term) || producto.categoria.toLowerCase().includes(term);
      const matchesUbicacion = ubicacion ? producto.ubicacion === ubicacion : true; // Filtra por ubicación si está seleccionada
      return matchesSearch && matchesUbicacion;
    });
    setFilteredProductos(filtered);
  };

  const handleAgregarCarrito = async (productoId, cantidad) => {
    console.log(id);  // Asegúrate de que el id del estudiante se obtiene correctamente
    console.log(productoId);

    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token'); 
      console.log(token);
  
      // Verificar si el token existe
      if (!token) {
        console.error('Token no encontrado');
        return;
      }  

      // Realiza la solicitud POST para agregar el producto al carrito
      await axios.post(`http://localhost:8081/api/estudiantes/producto/agregar/${id}/${productoId}?cantidad=${cantidad}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
        }
      );

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
      {/* Barra de búsqueda */}
      <div className="d-flex align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre o categoría"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="me-2"
        />
        
        {/* Ícono de filtro */}
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={
            <Popover id="popover-filter">
              <Popover.Body>
                <Form.Control
                  as="select"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                >
                  <option value="">Todas las ubicaciones</option>
                  <option value="LABORATORIO_ELECTRÓNICA">Laboratorio Electrónica</option>
                  <option value="LABORATORIO_PROTOTIPADO">Laboratorio Prototipado</option>
                  <option value="LABORATORIO_TELEMÁTICA">Laboratorio Telemática</option>
                  <option value="BODEGA">Bodega</option>
                </Form.Control>
              </Popover.Body>
            </Popover>
          }
        >
          <Filter size={20} style={{ cursor: 'pointer' }} />
        </OverlayTrigger>
      </div>

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





