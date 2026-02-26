import { useState, useRef } from "react"; // Importa useRef
import axios from "axios";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";

const Quejas = () => {
  const { id } = useParams();
  const fileInputRef = useRef(null); // Referencia para el input de archivo

  const [formData, setFormData] = useState({
    asunto: "",
    mensaje: "",
  });
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      let archivoBase64 = null;
      if (archivo) {
        const reader = new FileReader();
        const filePromise = new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
        });
        reader.readAsDataURL(archivo);
        archivoBase64 = await filePromise;
      }

      const requestBody = {
        asunto: formData.asunto,
        mensaje: formData.mensaje,
        estudianteId: id,
        archivo: archivoBase64,
      };

      const response = await axios.post(
        "http://localhost:8081/api/estudiantes/correos/quejas",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "Exito") {
        setSuccess("Su recurso ha sido enviado con éxito.");
        setFormData({ asunto: "", mensaje: "" });
        setArchivo(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Limpiar el input de archivo
        }
      } else {
        setSuccess("Hubo un problema al enviar la solicitud.");
      }
    } catch (error) {
      setSuccess("Error al enviar la solicitud. Intente de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Quejas & Peticiones</h3>
      {success && <Alert variant={success.includes("Error") ? "danger" : "success"}>{success}</Alert>}
      <hr className="my-4" />
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Asunto</Form.Label>
          <Form.Control type="text" name="asunto" value={formData.asunto} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control as="textarea" rows={10} name="mensaje" value={formData.mensaje} onChange={handleChange} required />
        </Form.Group>

        {/* Campo de carga de archivo */}
        <Form.Group className="mb-3">
          <Form.Label>Adjuntar archivo (opcional)</Form.Label>
          <Form.Control ref={fileInputRef} type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png" />
          <small className="text-muted">Solo se permite subir un archivo (JPG, PNG).</small>
        </Form.Group>

        <Form.Group className="mb-3">
          <Button variant="primary" type="submit" disabled={loading} className="d-block w-100">
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                {" Enviando..."}
              </>
            ) : (
              "Enviar"
            )}
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Quejas;