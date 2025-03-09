import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import axios from "axios";
import { CSSTransition } from "react-transition-group";
import "./css/Cuenta.css";

const Cuenta = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cuenta, setCuenta] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    cedula: "",
    name: "",
    address: "",
    numeroTelefono: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Get the account information everytime the id change
   * */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }

    setIsLoading(true);
    axios
      .get(`https://labuq.catavento.co:10443/api/estudiantes/informacion-cuenta/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCuenta(response.data.data);
        setFormData(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Error al obtener la información de la cuenta");
        console.error(error);
        setIsLoading(false);
      });
  }, [id]);

  /**
   * handles the change of the input form
   * @param {*} e
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * handles the functionality to update the account information
   * @returns
   */
  const handleUpdateAccount = async () => {
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    try {
      const response = await axios.put(
        `https://labuq.catavento.co:10443/api/estudiantes/actualizar/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSuccessMessage(response.data.message);
      setIsLoading(false);
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "Error al actualizar la información",
      );
      console.error(error);
      setIsLoading(false);
    }
  };

  /**
   * handle the functionality to delete the user account
   * @returns
   */
  const handleDeleteAccount = async () => {
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      const response = await axios.delete(
        `https://labuq.catavento.co:10443/api/estudiantes/eliminar/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSuccessMessage(response.data.message);
      localStorage.removeItem("token");
      navigate("/");
      setIsLoading(false);
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "Error al eliminar la cuenta",
      );
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Mi Cuenta</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <CSSTransition
        in={cuenta !== null}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <div>
          {cuenta ? (
            <Card>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaUser /> Nombre
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaEnvelope /> Correo Electrónico
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaPhone /> Teléfono
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="numeroTelefono"
                      value={formData.numeroTelefono}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaMapMarkerAlt /> Dirección
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaUser /> Cédula
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    onClick={handleUpdateAccount}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <FaEdit />
                    )}
                    {isLoading ? " Cargando..." : "Actualizar Información"}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeleteAccount}
                    className="ms-3"
                    disabled={true}
                  >
                    {isLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <FaTrashAlt />
                    )}
                    {isLoading ? " Cargando..." : "Eliminar Cuenta"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <p>Cargando información...</p>
          )}
        </div>
      </CSSTransition>
    </Container>
  );
};

export default Cuenta;
