import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import TablaDetalles from "../tablas/TablaDetalles";

const DetallesPrestamoModal = ({ prestamoId, show, onClose }) => {
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
            setError("Token no encontrado");
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
          setDetalles([]);
          console.log(err);
          const token = localStorage.getItem("token");
          if (!token) {
            setError("Token no encontrado.");
            return;
          }
          try {
            // do the delete request (idk why, I am comming  crazy)
            const response = await axios.delete(
              `https://labuq.catavento.co:10443/api/admin/prestamos/eliminar/${prestamoId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
          } catch (error) {
            console.log(error);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchDetalles();
    }
  }, [prestamoId]);

  /**
   * handles functionality to delete a load detail
   * @param {*} idDetallePrestamo
   * @returns
   */
  const handleEliminarDetalle = async (idDetallePrestamo) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar el detalle con ID ${idDetallePrestamo}?`,
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token no encontrado");
          return;
        }
        await axios.delete(
          `https://labuq.catavento.co:10443/api/admin/detalles/eliminar/${idDetallePrestamo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setDetalles((prevDetalles) =>
          prevDetalles.filter((detalle) => detalle.id !== idDetallePrestamo),
        );
      } catch (err) {
        alert(
          `Error al eliminar el detalle: ${err.response?.data?.message || err.message}`,
        );
      }
    }
  };

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
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Préstamo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando detalles...</span>
            </div>
          </div>
        ) : (
          <TablaDetalles
            detalles={detalles}
            onEliminar={handleEliminarDetalle}
          />
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

export default DetallesPrestamoModal;
