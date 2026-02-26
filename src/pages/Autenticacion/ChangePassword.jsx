import { useState } from "react";
import { FaEnvelope, FaLockOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    verificationCode: "",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const navigate = useNavigate();

  /**
   * handles the change of the input form
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
   * handles the sent of the verification code
   */
  const sendVerificationCode = async () => {
    setIsLoadingCode(true);
    try {
      const idResponse = await fetch(
        `http://localhost:8081/api/estudiantes/id-by-email?email=${formData.email}`,
      );
      if (!idResponse.ok) {
        throw new Error("Error al obtener el ID del estudiante");
      }
      const { data } = await idResponse.json();
      const estudianteId = data.id;
      await fetch(
        `http://localhost:8081/api/autenticacion/enviar-verificacion/${estudianteId}`,
        { method: "POST" },
      );
      setIsVerificationSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingCode(false);
    }
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
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }
    setIsLoadingSubmit(true);
    try {
      const idResponse = await fetch(
        `http://localhost:8081/api/estudiantes/id-by-email?email=${formData.email}`,
      );
      if (!idResponse.ok) {
        throw new Error("El email no se encuentra registrado");
      }
      const { data } = await idResponse.json();
      const estudianteId = data.id;
      const response = await fetch(
        `http://localhost:8081/api/autenticacion/cambiar-contraseña/${estudianteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nuevaContraseña: formData.newPassword,
            codigoVerificación: formData.verificationCode,
          }),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cambiar la contraseña");
      }
      setSuccessMessage("Contraseña cambiada exitosamente");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingSubmit(false);
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
        style={{ width: "100%", maxWidth: "500px", overflowY: "auto" }}
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
                  "Código enviado"
                ) : (
                  "Enviar código"
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
              "Cambiar contraseña"
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ChangePassword;
