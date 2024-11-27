import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa'; // Importamos el ícono del carrito

const ProductoCard = ({ producto, onAgregarCarrito, onClick, cantidadDisponible }) => {
  const [cantidad, setCantidad] = useState(1);

  // Limitar la cantidad a la cantidad disponible
  const handleCantidadChange = (e) => {
    const nuevaCantidad = Math.min(e.target.value, cantidadDisponible); // No permitir más cantidad que la disponible
    setCantidad(nuevaCantidad);
  };

  return (
    <Card style={{ height: '100%', textAlign: 'center', padding: '10px' }}>
      <Card.Img
        variant="top"
        src={`data:image/png;base64,${producto.imagen}`}
        alt={producto.nombre}
        style={{ height: '150px', objectFit: 'cover' }}
        onClick={onClick}
      />
      <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card.Title>{producto.nombre}</Card.Title>
        <Card.Text>{producto.descripcion}</Card.Text>
        <Form.Control
          type="number"
          min="1"
          max={cantidadDisponible}  // Limitamos la cantidad máxima al disponible
          value={cantidad}
          onChange={handleCantidadChange}  // Usamos la función que limita la cantidad
        />
        
        {/* Botón centrado con margen superior adicional */}
        <Button
          variant="primary"
          onClick={() => onAgregarCarrito(producto.id, cantidad)}  // Pasamos la cantidad seleccionada
          style={{
            width: '40px', // Ancho fijo para hacerlo cuadrado
            height: '40px', // Alto fijo para hacerlo cuadrado
            padding: '0', // Elimina cualquier padding adicional
            fontSize: '1.5rem', // Tamaño del ícono
            display: 'flex',
            justifyContent: 'center', // Centra el ícono horizontalmente
            alignItems: 'center', // Centra el ícono verticalmente
            borderRadius: '5px', // Opcional: bordes redondeados
            marginTop: '10px', // Margen superior para separarlo más del campo de cantidad
          }}
        >
          <FaShoppingCart /> {/* Ícono de carrito */}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductoCard;




