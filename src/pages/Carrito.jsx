// src/pages/Carrito.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Carrito = () => {
  const [productosEnCarrito, setProductosEnCarrito] = useState([]);

  // Simulando la obtención de los productos en el carrito (puedes hacer una solicitud real para obtener los productos del carrito)
  useEffect(() => {
    // Si tienes una API que devuelve los productos en el carrito, usa algo similar a esto:
    // axios.get(`http://localhost:8081/api/estudiantes/${estudianteId}/carrito`)
    //   .then(response => setProductosEnCarrito(response.data))
    //   .catch(error => console.error("Error al cargar el carrito:", error));

    // Por ahora, usaremos datos de ejemplo:
    setProductosEnCarrito([
      { id: 1, nombre: 'Laptop HP', cantidad: 2, precio: 500 },
      { id: 2, nombre: 'Laptop ASUS', cantidad: 1, precio: 700 }
    ]);
  }, []);

  const total = productosEnCarrito.reduce((acc, producto) => acc + (producto.cantidad * producto.precio), 0);

  return (
    <div>
      <h2>Carrito de Compras</h2>
      {productosEnCarrito.length === 0 ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        <div>
          <ul>
            {productosEnCarrito.map(producto => (
              <li key={producto.id}>
                <p>{producto.nombre} - Cantidad: {producto.cantidad} - Precio: ${producto.precio}</p>
              </li>
            ))}
          </ul>
          <h3>Total: ${total}</h3>
          <button>Proceder al pago</button>
        </div>
      )}
    </div>
  );
};

export default Carrito;
