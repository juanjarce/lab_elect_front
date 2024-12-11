import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';

const ProductoCard = ({ producto, onAgregarCarrito, onClick, cantidadDisponible }) => {
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(false);  // Estado para controlar la animación de carga

  useEffect(() => {
    setCantidad(1);
  }, [producto.id, cantidadDisponible]);

  const handleCantidadChange = (e) => {
    const nuevaCantidad = Math.min(Number(e.target.value), cantidadDisponible);
    setCantidad(nuevaCantidad);
  };

  // Agregar el manejador de clics para el Card
  const handleCardClick = (e) => {
    // Evitar que el clic se registre cuando se hace clic en el campo de cantidad o el botón de agregar al carrito
    if (e.target.tagName !== 'INPUT' && e.target.closest('button') === null) {
      onClick(); // Llama a la función onClick pasada como prop
    }
  };

  // Función para manejar la adición al carrito con animación de carga
  const handleAgregarCarrito = async () => {
    setCargando(true); // Activar la animación de carga
    try {
      await onAgregarCarrito(producto.id, cantidad); // Simulación de agregar al carrito
    } catch (error) {
      console.error('Error al agregar al carrito', error);
    } finally {
      setCargando(false); // Desactivar la animación de carga después de la acción
    }
  };

  return (
    <Card
      className="producto-card"
      style={{ position: 'relative', height: '100%', padding: '10px' }}
      onClick={handleCardClick}
    >
      <Card.Img
        variant="top"
        src={`data:image/png;base64,${producto.imagen}`}
        alt={producto.nombre}
        style={{ height: '150px', objectFit: 'cover' }}
      />
      <Card.Body
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '100px' }}
      >
        <Card.Title>{producto.nombre}</Card.Title>
        <Card.Text>{producto.descripcion}</Card.Text>
      </Card.Body>

      <Form.Control
        type="number"
        min="1"
        max={cantidadDisponible}
        value={cantidad}
        onChange={handleCantidadChange}
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
        }}
      />

      <Button
        variant="primary"
        onClick={(e) => {
          e.stopPropagation(); // Evitar que el clic se propague al Card
          handleAgregarCarrito();
        }}
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '40px',
          padding: '0',
          fontSize: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '5px',
        }}
      >
        {cargando ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <FaShoppingCart />
        )}
      </Button>
    </Card>
  );
};

export default ProductoCard;

