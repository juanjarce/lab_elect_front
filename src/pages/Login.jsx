import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para el botón de carga
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUserTypeChange = (e) => {
    setIsAdmin(e.target.value === 'admin');
    setFormData({ username: '', password: '' }); // Reiniciar el formulario
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true); // Mostrar animación de carga

    const url = isAdmin
      ? 'http://localhost:8081/api/autenticacion/login-admin'
      : 'http://localhost:8081/api/autenticacion/login-estudiante';

    const payload = isAdmin
      ? { username: formData.username, password: formData.password }
      : { email: formData.username, password: formData.password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      const token = data.data;
      localStorage.setItem('token', token);

      // Obtener el ID dependiendo si es admin o estudiante
      let id;
      if (isAdmin) {
        const idResponse = await fetch(
          `http://localhost:8081/api/admin/id?username=${formData.username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!idResponse.ok) {
          throw new Error('Error al obtener el ID del administrador');
        }
        const { data: adminData } = await idResponse.json();
        id = adminData.id;

        // Redirigir con transición
        navigate(`/admin-dashboard/${id}`);
      } else {
        const idResponse = await fetch(
          `http://localhost:8081/api/estudiantes/id-by-email?email=${formData.username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!idResponse.ok) {
          throw new Error('Error al obtener el ID del estudiante');
        }
        const { data: studentData } = await idResponse.json();
        id = studentData.id;

        // Redirigir con transición
        navigate(`/estudiante-dashboard/${id}`);
      }
    } catch (err) {
      console.error('Error en el login:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false); // Ocultar animación de carga
    }
  };

  return (
    <motion.div
      className="d-flex justify-content-center align-items-center vh-100"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Iniciar sesión</h3>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <div className="form-check form-check-inline">
              <input
                type="radio"
                className="form-check-input"
                name="userType"
                value="student"
                checked={!isAdmin}
                onChange={handleUserTypeChange}
              />
              <label className="form-check-label">Estudiante-Docente</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                className="form-check-input"
                name="userType"
                value="admin"
                checked={isAdmin}
                onChange={handleUserTypeChange}
              />
              <label className="form-check-label">Administrador</label>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              {isAdmin ? 'Usuario' : 'Email'}
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading} // Deshabilitar botón mientras carga
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        <div className="mt-3 text-center">
          <button
            onClick={() => navigate('/registro')}
            className="btn btn-link p-0 m-1"
            style={{ textDecoration: 'none' }}
          >
            ¿No tienes cuenta? Regístrate
          </button>
          <button
            onClick={() => navigate('/recuperar-contrasenia')}
            className="btn btn-link p-0 m-1"
            style={{ textDecoration: 'none' }}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
