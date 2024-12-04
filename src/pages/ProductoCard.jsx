import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa'; // Importamos el ícono del carrito

const ProductoCard = ({ producto, onAgregarCarrito, onClick, cantidadDisponible }) => {
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    // Reseteamos la cantidad cuando la cantidad disponible cambia
    setCantidad(1);
  }, [producto.id, cantidadDisponible]); // Este hook se ejecuta cuando cambia el producto o la cantidad disponible

  // Limitar la cantidad a la cantidad disponible
  const handleCantidadChange = (e) => {
    const nuevaCantidad = Math.min(Number(e.target.value), cantidadDisponible); // Convertimos a número y no permitimos más que la cantidad disponible
    setCantidad(nuevaCantidad);
  };

  return (
    <Card style={{ position: 'relative', height: '100%', padding: '10px' }}>
      <Card.Img
        variant="top"
        src={`data:image/png;base64,${producto.imagen}`}
        alt={producto.nombre}
        style={{ height: '150px', objectFit: 'cover' }}
        onClick={onClick}
      />
      <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '100px' }}>
        <Card.Title>{producto.nombre}</Card.Title>
        <Card.Text>{producto.descripcion}</Card.Text>
      </Card.Body>

      {/* Campo para ingresar la cantidad, siempre en el mismo lugar */}
      <Form.Control
        type="number"
        min="1"
        max={cantidadDisponible}  // Limitamos la cantidad máxima al disponible
        value={cantidad}
        onChange={handleCantidadChange}  // Usamos la función que limita la cantidad
        style={{
          position: 'absolute',
          bottom: '60px', // Coloca el campo de cantidad por encima del botón
          left: '50%',
          transform: 'translateX(-50%)', // Centra el campo de cantidad horizontalmente
          width: '80%', // Ajusta el tamaño del campo de cantidad (ajustable)
        }}
      />

      {/* Botón siempre en la parte inferior */}
      <Button
        variant="primary"
        onClick={() => onAgregarCarrito(producto.id, cantidad)}  // Pasamos la cantidad seleccionada
        style={{
          position: 'absolute',
          bottom: '10px', // Asegura que esté en la parte inferior del Card
          left: '50%',
          transform: 'translateX(-50%)', // Centra el botón horizontalmente
          width: '40px', // Ancho fijo para hacerlo cuadrado
          height: '40px', // Alto fijo para hacerlo cuadrado
          padding: '0', // Elimina cualquier padding adicional
          fontSize: '1.5rem', // Tamaño del ícono
          display: 'flex',
          justifyContent: 'center', // Centra el ícono horizontalmente
          alignItems: 'center', // Centra el ícono verticalmente
          borderRadius: '5px', // Opcional: bordes redondeados
        }}
      >
        <FaShoppingCart /> {/* Ícono de carrito */}
      </Button>
    </Card>
  );
};

export default ProductoCard;
