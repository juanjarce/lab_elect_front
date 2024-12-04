import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null); // Para manejar mensajes de error
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
    setError(null); // Reiniciar el estado del error al intentar loguear

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
      const token = data.data; // El token JWT

      // Guardar el token en localStorage
      localStorage.setItem('token', token);

      console.log('Login exitoso:', data);

      // Obtener el ID dependiendo si es admin o estudiante
      let id;
      if (isAdmin) {
        const idResponse = await fetch(
          `http://localhost:8081/api/admin/id?username=${formData.username}`,
          { headers: { Authorization: `Bearer ${token}` } } // Incluir token
        );
        if (!idResponse.ok) {
          throw new Error('Error al obtener el ID del administrador');
        }
        const { data: adminData } = await idResponse.json();
        id = adminData.id;
        navigate(`/admin-dashboard/${id}`); // Redirigir al dashboard de admin con el ID
      } else {
        const idResponse = await fetch(
          `http://localhost:8081/api/estudiantes/id-by-email?email=${formData.username}`,
          { headers: { Authorization: `Bearer ${token}` } } // Incluir token
        );
        if (!idResponse.ok) {
          throw new Error('Error al obtener el ID del estudiante');
        }
        const { data: studentData } = await idResponse.json();
        id = studentData.id;
        navigate(`/estudiante-dashboard/${id}`); // Redirigir al dashboard de estudiante con el ID
      }
    } catch (err) {
      console.error('Error en el login:', err.message);
      setError(err.message); // Mostrar el mensaje de error en pantalla
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
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
              <label className="form-check-label">Estudiante</label>
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

          <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
        </form>

        <div className="mt-3 text-center">
          <a href="/registro" className="d-block mb-2">¿No tienes cuenta? Regístrate</a>
          <a href="/recuperar-contraseña" className="d-block">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
