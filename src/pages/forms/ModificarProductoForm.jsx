import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const ModificarProductoForm = ({ show, onClose, onSave, producto }) => {
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    disponibleParaPrestamo: false,
    cantidad: "",
    imagen: null,
    categoria: "",
    codigoActivosFijos: "",
    linkDataSheet: "",
    ubicacion: "",
    responsable: "",
  });

  const [imageError, setImageError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * handles the submition of the form
   * @param {*} event
   * @returns
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (imageError) {
      return;
    }
    setIsLoading(true);
    try {
      const formDataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        disponibleParaPrestamo: formData.disponibleParaPrestamo,
        cantidad: formData.cantidad,
        imagen: formData.imagen || null,
        categoria: formData.categoria,
        codigoActivosFijos: formData.codigoActivosFijos,
        linkDataSheet: formData.linkDataSheet || "",
        ubicacion: formData.ubicacion,
        responsable: formData.responsable,
      };
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        setIsLoading(false);
        return;
      }
      await axios.put(
        `http://localhost:8081/api/admin/productos/actualizar/${formData.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      onSave(formDataToSend);
      onClose();
    } catch (error) {
      console.error("Error al modificar el producto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * handles the image for the product
   * @param {*} event
   */
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeInKB = file.size / 1024;
      if (fileSizeInKB > 64) {
        setImageError("La imagen no debe superar los 64KB.");
      } else {
        setImageError("");
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, imagen: reader.result.split(",")[1] });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  useEffect(() => {
    if (producto) {
      setFormData({
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        disponibleParaPrestamo: producto.disponibleParaPrestamo,
        cantidad: producto.cantidad,
        imagen: null,
        categoria: producto.categoria,
        codigoActivosFijos: producto.codigoActivosFijos,
        linkDataSheet: producto.linkDataSheet || "",
        ubicacion: producto.ubicacion || "",
        responsable: producto.responsable || "",
      });
    }
  }, [producto]);

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Campo ID Producto */}
          <Form.Group controlId="id">
            <Form.Label>ID Producto</Form.Label>
            <Form.Control type="text" value={formData.id} disabled />
          </Form.Group>

          {/* Campo Nombre Producto */}
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              required
            />
          </Form.Group>

          {/* Campo Descripción */}
          <Form.Group controlId="descripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              required
            />
          </Form.Group>

          {/* Campo Cantidad */}
          <Form.Group controlId="cantidad">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              value={formData.cantidad}
              onChange={(e) =>
                setFormData({ ...formData, cantidad: e.target.value })
              }
              required
            />
          </Form.Group>

          {/* Campo Imagen */}
          <Form.Group controlId="imagen">
            <Form.Label>Imagen (Base64)</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
            {imageError && <Alert variant="danger">{imageError}</Alert>}
            <Form.Text className="text-muted">
              Si no desea cambiar la imagen, puede dejar este campo vacío.
            </Form.Text>
          </Form.Group>

          {/* Campo Categoría */}
          <Form.Group controlId="categoria">
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              as="select"
              value={formData.categoria}
              onChange={(e) =>
                setFormData({ ...formData, categoria: e.target.value })
              }
            >
              <option value="EQUIPOS">Equipos</option>
              <option value="COMPONENTES">Componentes</option>
              <option value="TARJETAS">Tarjetas</option>
            </Form.Control>
          </Form.Group>

          {/* Campo Código de Activo Fijo */}
          <Form.Group controlId="codigoActivosFijos">
            <Form.Label>Código de Activo Fijo</Form.Label>
            <Form.Control
              type="text"
              value={formData.codigoActivosFijos}
              onChange={(e) =>
                setFormData({ ...formData, codigoActivosFijos: e.target.value })
              }
            />
          </Form.Group>

          {/* Campo Link DataSheet */}
          <Form.Group controlId="linkDataSheet">
            <Form.Label>Link DataSheet</Form.Label>
            <Form.Control
              type="text"
              value={formData.linkDataSheet}
              onChange={(e) =>
                setFormData({ ...formData, linkDataSheet: e.target.value })
              }
            />
          </Form.Group>

          {/* Campo Ubicación */}
          <Form.Group controlId="ubicacion">
            <Form.Label>Ubicación</Form.Label>
            <Form.Control
              as="select"
              value={formData.ubicacion}
              onChange={(e) =>
                setFormData({ ...formData, ubicacion: e.target.value })
              }
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
            </Form.Control>
          </Form.Group>

          {/* Campo Responsable */}
          <Form.Group controlId="responsable">
            <Form.Label>Responsable</Form.Label>
            <Form.Control
              type="text"
              value={formData.responsable}
              onChange={(e) =>
                setFormData({ ...formData, responsable: e.target.value })
              }
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={isLoading || imageError}
            className="mt-3"
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                {" Guardando..."}
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificarProductoForm;
