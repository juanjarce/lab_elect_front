import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';

const ProductoCard = ({ producto, onClick }) => {
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(false);  // Estado para controlar la animación de carga

  useEffect(() => {
  
  }, [producto.id]);

  // Agregar el manejador de clics para el Card
  const handleCardClick = (e) => {
    // Evitar que el clic se registre cuando se hace clic en el campo de cantidad o el botón de agregar al carrito
    if (e.target.tagName !== 'INPUT' && e.target.closest('button') === null) {
      onClick(); // Llama a la función onClick pasada como prop
    }
  };

  return (
    <Card
      className="producto-card"
      style={{
        position: 'relative',
        height: '100%',
        padding: '10px',
        maxWidth: '300px', // Ajusta el ancho máximo de la tarjeta
        margin: '10px', // Margen entre tarjetas
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={handleCardClick}
    >
      <Card.Img
        variant="top"
        src={`data:image/png;base64,${producto.imagen}`}
        alt={producto.nombre}
        style={{
          height: '150px',
          objectFit: 'cover',
        }}
      />
      <Card.Body
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '10px',
          flexGrow: 1, // Para que el contenido se ajuste de manera flexible
        }}
      >
        <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{producto.nombre}</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default ProductoCard;


