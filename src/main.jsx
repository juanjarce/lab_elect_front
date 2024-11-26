import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Asegúrate de importar App aquí
import './index.css';     // Estilos de la aplicación

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />  {/* Renderiza App en lugar de las rutas directamente */}
  </React.StrictMode>
);



