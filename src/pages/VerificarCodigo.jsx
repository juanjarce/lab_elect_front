import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const VerificarCodigo = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Extrae el ID desde los parámetros de la URL
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado de carga del botón

  const handleInputChange = (e) => {
    setCodigo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true); // Activar estado de carga

    try {
      // Construimos la URL con el ID del estudiante y el código de verificación
      const response = await fetch(
        `http://localhost:8081/api/autenticacion/estudiantes/${id}/activar?verificationCode=${codigo}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al verificar el código');
      }

      setSuccessMessage('Cuenta activada exitosamente.');
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Desactivar estado de carga
    }
  };

  return (
    <motion.div
      className="d-flex justify-content-center align-items-center vh-100"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="card p-4 shadow-lg"
        style={{ width: '100%', maxWidth: '400px' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-center mb-4">Verificar cuenta</h3>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {successMessage && (
          <div className="alert alert-success text-center">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="codigo" className="form-label">
              Código de Verificación
            </label>
            <input
              type="text"
              className="form-control"
              id="codigo"
              value={codigo}
              onChange={handleInputChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading} // Deshabilitar mientras se procesa
          >
            {isLoading ? (
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status"
              >
                <span className="visually-hidden">Cargando...</span>
              </div>
            ) : (
              'Verificar'
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default VerificarCodigo;
