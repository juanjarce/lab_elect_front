import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import { CSSTransition } from "react-transition-group";
import "./css/PrestamoCardDevueltos.css";

const PrestamoCardDevueltos = ({ prestamo, onVerDetalles }) => {
  const [estudianteNombre, setEstudianteNombre] = useState("");
  const [estudianteCedula, setEstudianteCedula] = useState("");
  const [inProp, setInProp] = useState(false);

  /**
   * fetch the studend info
   * */
  useEffect(() => {
    const fetchEstudianteName = async () => {
      try {
        const response = await axios.get(
          `https://labuq.catavento.co:10443/api/admin/estudiante/info?id=${prestamo.idEstudiante}`,
        );
        setEstudianteNombre(response.data.data.nombre);
        setEstudianteCedula(response.data.data.cedula);
      } catch (err) {
        setEstudianteNombre("Nombre no disponible");
        setEstudianteCedula("Cedula no disponible");
      }
    };
    fetchEstudianteName();
    setInProp(true);
  }, [prestamo.idEstudiante]);

  return (
    <div className="col-sm-12 col-md-6 col-lg-4">
      <CSSTransition
        in={inProp} // Usa el estado inProp para controlar la animación
        timeout={500} // Duración de la animación
        classNames="card-transition" // Nombre base de las clases de animación
        unmountOnExit
      >
        <Card
          className="prestamo-card mb-3 shadow-sm"
          onClick={() => onVerDetalles(prestamo.id)}
          style={{ cursor: "pointer" }}
        >
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <Card.Title className="mb-1">Préstamo #{prestamo.id}</Card.Title>
              <Card.Subtitle className="text-muted">
                Estudiante: {estudianteNombre}
              </Card.Subtitle>
              <Card.Text className="mt-2">
                Fecha de Solicitud:{" "}
                {new Date(prestamo.fechaSolicitud).toLocaleDateString()} <br />
                Estado:{" "}
                <span className="badge bg-success">{prestamo.estado}</span>
              </Card.Text>
            </div>
          </Card.Body>
        </Card>
      </CSSTransition>
    </div>
  );
};

export default PrestamoCardDevueltos;
