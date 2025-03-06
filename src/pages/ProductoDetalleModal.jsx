import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { FaCartPlus } from "react-icons/fa"; // Ícono de carrito
import axios from "axios";
import { Spinner } from "react-bootstrap"; // Agregar esta línea

const ProductoDetalleModal = ({ producto, id, onClose }) => {
  const [cantidadDisponible, setCantidadDisponible] = useState(null);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
  const [loadingCantidad, setLoadingCantidad] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * get the available quantity
   * */
  useEffect(() => {
    const obtenerCantidadDisponible = async () => {
      setLoadingCantidad(true);
      try {
        const response = await axios.get(
          `https://labuq.catavento.co:10443/api/estudiantes/productos/${producto.id}/cantidad-disponible`,
        );
        if (response.data.status === "Exito") {
          setCantidadDisponible(response.data.data.cantDisponible);
        } else {
          setCantidadDisponible(0);
          setError("Cantidad no disponible.");
        }
      } catch (err) {
        setError("Error al obtener la cantidad disponible.");
        setCantidadDisponible(0);
        console.log(err);
      } finally {
        setLoadingCantidad(false);
      }
    };
    obtenerCantidadDisponible();
  }, [producto.id]);

  /**
   * handles the add to cart functionality
   * @returns
   */
  const handleAgregarCarrito = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token no encontrado.");
      return;
    }
    try {
      await axios.post(
        `https://labuq.catavento.co:10443/api/estudiantes/producto/agregar/${id}/${producto.id}?cantidad=${cantidadSeleccionada}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCantidadDisponible((prev) => prev - cantidadSeleccionada);
      setCantidadSeleccionada(1);
      setSuccessMessage("Producto agregado al carrito con éxito.");
      setLoading(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error al agregar el producto al carrito.",
      );
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form>
          <Form.Group>
            <Form.Label>ID Producto</Form.Label>
            <Form.Control type="text" value={producto.id} disabled />
          </Form.Group>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" value={producto.nombre} disabled />
          </Form.Group>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={producto.descripcion}
              disabled
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Categoría</Form.Label>
            <Form.Control type="text" value={producto.categoria} disabled />
          </Form.Group>
          <Form.Group>
            <Form.Label>Total Existencias</Form.Label>
            <Form.Control type="text" value={producto.cantidad} disabled />
          </Form.Group>
          <Form.Group>
          <Form.Label>Link DataSheet</Form.Label>
            <div className="text-truncate" style={{ width: "100%" }}>
              <a href={producto.linkDataSheet} target="_blank" rel="noopener noreferrer">
                {producto.linkDataSheet}
              </a>
            </div>
          </Form.Group>
          <hr />
          <Form.Group>
            <Form.Label>Cantidad Disponible</Form.Label>
            <Form.Control
              type="text"
              value={loadingCantidad ? "Cargando..." : cantidadDisponible}
              disabled
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Seleccionar Cantidad</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max={cantidadDisponible || 1}
              value={cantidadSeleccionada}
              onChange={(e) => setCantidadSeleccionada(Number(e.target.value))}
              disabled={cantidadDisponible === 0}
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleAgregarCarrito}
            disabled={
              cantidadDisponible === 0 ||
              cantidadSeleccionada > cantidadDisponible ||
              loading
            }
            className="mt-3 w-100"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
              </>
            ) : (
              <>
                <FaCartPlus className="me-2" />
                Agregar al Carrito
              </>
            )}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductoDetalleModal;

