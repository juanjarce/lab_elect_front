import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";

const DetallesPrestamoForm = ({ prestamoId, show, onClose }) => {
  const { id } = useParams();
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [detalleAConfirmar, setDetalleAConfirmar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * load the details of loan
   * */
  useEffect(() => {
    if (prestamoId) {
      const fetchDetalles = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("Token no encontrado");
            return;
          }
          const response = await axios.get(
            `https://labuq.catavento.co:10443/api/admin/prestamos/${prestamoId}/detalles`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (response.data.status === "Exito") {
            setDetalles(response.data.data || []);
          } else {
            setError("No se pudieron obtener los detalles.");
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetalles();
    }
  }, [prestamoId]);

  /**
   * handles the functionality to confirm a loan
   */
  const handleConfirmarEntrega = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `https://labuq.catavento.co:10443/api/admin/detalle/devolver/${detalleAConfirmar.id}/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.status === "Exito") {
        setDetalles((prevDetalles) =>
          prevDetalles.map((detalle) =>
            detalle.id === detalleAConfirmar.id
              ? { ...detalle, estado: "DEVUELTO" }
              : detalle,
          ),
        );
        setShowConfirm(false);
      } else {
        setError("Error al marcar como entregado.");
      }
    } catch (err) {
      setError(`Error al entregar el detalle: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * handle the functionality to clear the details
   */
  const handleCloseModal = () => {
    setDetalles([]);
    onClose();
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Préstamo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Panel de confirmación */}
        {showConfirm && (
          <Alert variant="warning">
            <p>
              ¿Estás seguro de que deseas marcar este detalle como entregado?
            </p>
            <Button variant="danger" onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button
              variant="success"
              onClick={handleConfirmarEntrega}
              disabled={isSubmitting}
            >
              {/* Mostrar spinner si está enviando */}
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  {" Enviando..."}
                </>
              ) : (
                "Confirmar Entrega"
              )}
            </Button>
          </Alert>
        )}

        {loading ? (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando detalles...</span>
            </Spinner>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Categoría</th>
                  <th>Link DataSheet</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle, index) => (
                  <tr key={index}>
                    <td>
                      {detalle.producto.imagen ? (
                        <img
                          src={`data:image/jpeg;base64,${detalle.producto.imagen}`}
                          alt={detalle.producto.nombre}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        "No disponible"
                      )}
                    </td>
                    <td>{detalle.producto.nombre}</td>
                    <td>{detalle.cantidad}</td>
                    <td>{detalle.producto.categoria || "No disponible"}</td>
                    <td>
                      {detalle.producto.linkDataSheet ? (
                        <a
                          href={detalle.producto.linkDataSheet}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver DataSheet
                        </a>
                      ) : (
                        "No disponible"
                      )}
                    </td>
                    <td>{detalle.estado}</td>
                    <td>
                      {detalle.estado !== "DEVUELTO" && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setDetalleAConfirmar(detalle);
                            setShowConfirm(true);
                          }}
                        >
                          <FaCheckCircle />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetallesPrestamoForm;
