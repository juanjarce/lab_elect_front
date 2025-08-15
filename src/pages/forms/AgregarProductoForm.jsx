import { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";

const AgregarProductoForm = ({ show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    cantidad: 0,
    disponibleParaPrestamo: true,
    imagen: null,
    categoria: "EQUIPOS",
    codigoActivosFijos: "", // Opcional
    linkDataSheet: "", // Opcional
    ubicacion: "LABORATORIO_ELECTRÓNICA",
    responsable: "", // Campo obligatorio
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la animación de carga

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
      setError("Debe subir una imagen del producto.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró el token de autenticación.");
      return;
    }
    setError("");
    setIsLoading(true);
    const formDataToSend = { ...formData, imagen: formData.imagen };
    try {
      const response = await axios.post(
        "https://labuq.catavento.co:10443/api/admin/productos/agregar",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Producto agregado:", response.data);
      onSave(response.data);
      setFormData({
        nombre: "",
        descripcion: "",
        cantidad: 0,
        disponibleParaPrestamo: true,
        imagen: null,
        categoria: "EQUIPOS",
        codigoActivosFijos: "",
        linkDataSheet: "",
        ubicacion: "LABORATORIO_ELECTRÓNICA",
        responsable: "",
      });
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      setError("Error al agregar el producto. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto</Modal.Title>
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
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleInputChange}
              min="0"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              required
            >
              <option value="EQUIPOS">EQUIPOS</option>
              <option value="COMPONENTES">COMPONENTES</option>
              <option value="TARJETAS">TARJETAS</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Imagen</Form.Label>
            <Form.Control type="file" onChange={handleImageUpload} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Código de Activos Fijos</Form.Label>
            <Form.Control
              type="text"
              name="codigoActivosFijos"
              value={formData.codigoActivosFijos}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Link Datasheet</Form.Label>
            <Form.Control
              type="text"
              name="linkDataSheet"
              value={formData.linkDataSheet}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Ubicación del Laboratorio</Form.Label>
            <Form.Select
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleInputChange}
              required
            >
              <option value="LABORATORIO_ELECTRÓNICA">
                Laboratorio Electrónica
              </option>
              <option value="LABORATORIO_PROTOTIPADO">
                Laboratorio Prototipado
              </option>
              <option value="LABORATORIO_TELEMÁTICA">
                Laboratorio Telemática
              </option>
              <option value="BODEGA">Bodega</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Responsable</Form.Label>
            <Form.Control
              type="text"
              name="responsable"
              value={formData.responsable}
              onChange={handleInputChange}
            />
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

AgregarProductoForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AgregarProductoForm;
