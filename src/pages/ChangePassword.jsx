import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaLockOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    verificationCode: '', // Campo para el código de verificación
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false); // Controlar si se envió el código
  const [isLoadingCode, setIsLoadingCode] = useState(false); // Estado de carga del botón de código
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false); // Estado de carga del botón de cambio de contraseña
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para enviar el código de verificación
  const sendVerificationCode = async () => {
    setIsLoadingCode(true); // Activar estado de carga del botón de código
    try {
      const idResponse = await fetch(
        `http://72.167.51.48:8082/api/estudiantes/id-by-email?email=${formData.email}`
      );
      if (!idResponse.ok) {
        throw new Error('Error al obtener el ID del estudiante');
      }
      const { data } = await idResponse.json();
      const estudianteId = data.id;

      // Enviar el código de verificación usando POST
      await fetch(
        `http://72.167.51.48:8082/api/autenticacion/enviar-verificacion/${estudianteId}`,
        { method: 'POST' }
      );

      setIsVerificationSent(true); // Indicar que el código se envió con éxito
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingCode(false); // Desactivar estado de carga del botón de código
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    setIsLoadingSubmit(true); // Activar estado de carga del botón de cambio de contraseña
    try {
      // Obtener el ID del estudiante
      const idResponse = await fetch(
        `http://72.167.51.48:8082/api/estudiantes/id-by-email?email=${formData.email}`
      );
      if (!idResponse.ok) {
        throw new Error('Error al obtener el ID del estudiante');
      }
      const { data } = await idResponse.json();
      const estudianteId = data.id;

      // Realizar la solicitud para cambiar la contraseña
      const response = await fetch(
        `http://72.167.51.48:8082/api/autenticacion/cambiar-contraseña/${estudianteId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contraseñaActual: formData.currentPassword,
            nuevaContraseña: formData.newPassword,
            codigoVerificación: formData.verificationCode, // Incluir el código de verificación
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cambiar la contraseña');
      }

      setSuccessMessage('Contraseña cambiada exitosamente');
      setTimeout(() => navigate('/'), 3000); // Redirigir después de 3 segundos
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingSubmit(false); // Desactivar estado de carga del botón de cambio de contraseña
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
        style={{ width: '100%', maxWidth: '500px', overflowY: 'auto' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-center mb-4">Cambio de Contraseña</h3>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {successMessage && (
          <div className="alert alert-success text-center">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <FaEnvelope /> Correo electrónico
            </label>
            <div className="d-flex">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-primary ms-2"
                onClick={sendVerificationCode}
                disabled={isVerificationSent || isLoadingCode}
              >
                {isLoadingCode ? (
                  <div
                    className="spinner-border spinner-border-sm text-primary"
                    role="status"
                  />
                ) : isVerificationSent ? (
                  'Código enviado'
                ) : (
                  'Enviar código'
                )}
              </button>
            </div>
          </div>

          {isVerificationSent && (
            <div className="mb-3">
              <label htmlFor="verificationCode" className="form-label">
                Código de verificación
              </label>
              <input
                type="text"
                className="form-control"
                id="verificationCode"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="currentPassword" className="form-label">
              <FaLock /> Contraseña actual
            </label>
            <input
              type="password"
              className="form-control"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              <FaLockOpen /> Nueva contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              <FaLockOpen /> Confirmar nueva contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoadingSubmit}
          >
            {isLoadingSubmit ? (
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status"
              />
            ) : (
              'Cambiar contraseña'
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ChangePassword;
