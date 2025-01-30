import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Row, Col, Button } from "react-bootstrap";
import PrestamoCard from "./PrestamoCard"; // Componente de la tarjeta
import DetallesPrestamoModal from "./DetallesPrestamoModal"; // Modal de detalles
import { debounce } from "lodash"; // Optimización de búsqueda
import { TransitionGroup, CSSTransition } from "react-transition-group"; // Animaciones

const Solicitados = () => {
  const [prestamos, setPrestamos] = useState([]); // Lista completa
  const [filteredPrestamos, setFilteredPrestamos] = useState([]); // Lista filtrada
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Control modal
  const [selectedPrestamoId, setSelectedPrestamoId] = useState(null); // ID préstamo

  // 🔹 Función para traer todos los préstamos paginados
  const fetchAllPrestamos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      let allPrestamos = [];
      let page = 0;
      let totalPages = 1;

      while (page < totalPages) {
        const response = await axios.get(
          `https://labuq.catavento.co:10443/api/admin/prestamos/solicitados?page=${page}&size=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.status === "Exito") {
          const prestamosWithNames = await Promise.all(
            response.data.data.content.map(async (prestamo) => {
              try {
                const estudianteResponse = await axios.get(
                  `https://labuq.catavento.co:10443/api/admin/estudiante/info?id=${prestamo.idEstudiante}`
                );
                return {
                  ...prestamo,
                  nombreEstudiante: estudianteResponse.data.data.nombre,
                  cedulaEstudiante: estudianteResponse.data.data.cedula,
                };
              } catch {
                return {
                  ...prestamo,
                  nombreEstudiante: "Nombre no disponible",
                  cedulaEstudiante: "Cédula no disponible",
                };
              }
            })
          );

          allPrestamos = [...allPrestamos, ...prestamosWithNames];
          totalPages = response.data.data.totalPages;
          page++;
        } else {
          break;
        }
      }

      setPrestamos(allPrestamos);
      setFilteredPrestamos(allPrestamos);
    } catch (err) {
      setError("Error al cargar los préstamos.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cargar todos los préstamos al montar el componente
  useEffect(() => {
    fetchAllPrestamos();
  }, []);

  // 🔹 Buscar en todos los préstamos cargados
  const handleSearchChange = debounce((value) => {
    setSearch(value);
    if (value === "") {
      setFilteredPrestamos(prestamos);
    } else {
      const lowercasedSearch = value.toLowerCase();
      const filtered = prestamos.filter(
        (prestamo) =>
          prestamo.id.toString().includes(lowercasedSearch) ||
          prestamo.nombreEstudiante?.toLowerCase().includes(lowercasedSearch) ||
          prestamo.cedulaEstudiante.toString().includes(lowercasedSearch)
      );
      setFilteredPrestamos(filtered);
    }
  }, 300);

  // 🔹 Ver detalles de préstamo
  const handleVerDetalles = (prestamoId) => {
    setSelectedPrestamoId(prestamoId);
    setShowModal(true);
  };

  // 🔹 Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPrestamoId(null);
  };

  // 🔹 Aprobar préstamo y actualizar lista
  const handleAprobar = async (prestamoId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      await axios.put(
        `https://labuq.catavento.co:10443/api/admin/prestamos/aprobar/${prestamoId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Recargar todos los préstamos después de aprobar
      fetchAllPrestamos();
    } catch (error) {
      console.error("Error al aprobar el préstamo:", error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>Préstamos Solicitados</h3>

      {/* 🔹 Barra de Búsqueda */}
      <Form className="mb-4">
        <Row>
          <Col xs={12}>
            <Form.Control
              type="text"
              placeholder="Buscar por ID, Nombre del Estudiante o Documento"
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-100"
            />
          </Col>
        </Row>
      </Form>

      {/* 🔹 Lista de Préstamos */}
      <div className="row">
        <TransitionGroup className="row">
          {filteredPrestamos.length > 0 ? (
            filteredPrestamos.map((prestamo) => (
              <CSSTransition key={prestamo.id} timeout={500} classNames="card-transition">
                <PrestamoCard
                  prestamo={prestamo}
                  onVerDetalles={handleVerDetalles}
                  onAprobar={() => handleAprobar(prestamo.id)}
                />
              </CSSTransition>
            ))
          ) : (
            <p>No hay resultados</p>
          )}
        </TransitionGroup>
      </div>

      {/* 🔹 Modal de Detalles */}
      <DetallesPrestamoModal
        prestamoId={selectedPrestamoId}
        show={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Solicitados;
