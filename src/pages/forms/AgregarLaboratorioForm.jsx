import { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";

const AgregarLaboratorioForm = ({ show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    capacidad: 0,
    imagen: null,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handles the change of the input form
   * @param {*} e
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * handles the image upload
   * @param {*} e
   */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 64 * 1024) {
        setError("La imagen no debe exceder los 64 KB.");
        setFormData({ ...formData, imagen: null });
      } else {
        setError("");
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, imagen: reader.result.split(",")[1] });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  /**
   * handle the submition of the form
   * @param {*} e
   * @returns
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) return;
    if (!formData.imagen) {
      setError("Debe subir una imagen del laboratorio.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró el token de autenticación.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8081/api/admin/laboratorios/agregar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Laboratorio agregado:", response.data);
      onSave(response.data);
      setFormData({ nombre: "", descripcion: "", capacidad: 0, imagen: null });
    } catch (error) {
      console.error("Error al agregar el laboratorio:", error);
      setError("Error al agregar el laboratorio. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Laboratorio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="number"
              name="capacidad"
              value={formData.capacidad}
              onChange={handleInputChange}
              min="1"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Imagen</Form.Label>
            <Form.Control type="file" onChange={handleImageUpload} />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="mt-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </Button>
          {error && (
            <Alert variant="danger" className="mt-2">
              {error}
            </Alert>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

AgregarLaboratorioForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AgregarLaboratorioForm;

