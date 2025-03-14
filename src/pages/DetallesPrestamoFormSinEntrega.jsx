import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";

const DetallesPrestamoFormSinEntrega = ({ prestamoId, show, onClose }) => {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * load the details of a loan
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
        } catch (err) {
          setError(
            `Error al cargar los detalles: ${err.response?.data?.message || err.message}`,
          );
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

export default DetallesPrestamoFormSinEntrega;
