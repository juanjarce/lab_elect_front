import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const VerificarCodigo = () => {
  const { id } = useParams();  // Extrae el ID desde los parámetros de la URL
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    setCodigo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Construimos la URL con el ID del estudiante y el código de verificación
      const response = await fetch(`http://localhost:8081/api/autenticacion/estudiantes/${id}/activar?verificationCode=${codigo}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al verificar el código');
      }

      setSuccessMessage('Cuenta activada exitosamente.');
      setTimeout(() => navigate('/'), 300);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Verificar cuenta</h3>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="codigo" className="form-label">Código de Verificación</label>
            <input
              type="text"
              className="form-control"
              id="codigo"
              value={codigo}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Verificar</button>
        </form>
      </div>
    </div>
  );
};

export default VerificarCodigo;

