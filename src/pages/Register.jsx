import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaIdCard,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    cedula: "",
    name: "",
    address: "",
    numeroTelefono: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * handles the input change of the register form
   * @param {*} e
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * handles the submition of the form
   * @param {*} e
   * @returns
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }
    try {
      const registerResponse = await fetch(
        "https://labuq.catavento.co:10443/api/autenticacion/registrar-estudiante",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cedula: formData.cedula,
            name: formData.name,
            address: formData.address,
            numeroTelefono: formData.numeroTelefono,
            email: formData.email,
            password: formData.password,
          }),
        },
      );
      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(
          errorData.message || "Error al registrar al estudiante",
        );
      }
      const idResponse = await fetch(
        `https://labuq.catavento.co:10443/api/estudiantes/id?cedula=${formData.cedula}`,
      );
      if (!idResponse.ok) {
        throw new Error("Error al obtener el ID del estudiante");
      }
      const idData = await idResponse.json();
      const id = idData.data.id;
      const verifyResponse = await fetch(
        `https://labuq.catavento.co:10443/api/autenticacion/enviar-verificacion/${id}`,
        {
          method: "POST",
        },
      );
      if (!verifyResponse.ok) {
        throw new Error("Error al enviar la verificación de la cuenta");
      }
      setSuccessMessage(
        "Registro exitoso. Revisa tu correo para activar tu cuenta.",
      );
      setTimeout(() => {
        navigate(`/verificar-codigo/${id}`);
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3 className="text-center mb-4">Registro</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaIdCard />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Cédula"
              name="cedula"
              value={formData.cedula}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nombre completo"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaHome />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Dirección"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaPhone />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Teléfono"
              name="numeroTelefono"
              value={formData.numeroTelefono}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaEnvelope />
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Correo electrónico"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaLock />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaLock />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Confirmar contraseña"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
