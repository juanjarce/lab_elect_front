import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";

const ProductoCard = ({ producto, onClick }) => {
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {}, [producto.id]);

  /**
   * handles the click action on the cards
   * @param {*} e
   */
  const handleCardClick = (e) => {
    if (e.target.tagName !== "INPUT" && e.target.closest("button") === null) {
      onClick();
    }
  };

  return (
    <Card
      className="producto-card"
      style={{
        position: "relative",
        height: "100%",
        padding: "10px",
        maxWidth: "300px",
        margin: "10px",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={handleCardClick}
    >
      <Card.Img
        variant="top"
        src={`data:image/png;base64,${producto.imagen}`}
        alt={producto.nombre}
        style={{
          height: "150px",
          objectFit: "cover",
        }}
      />
      <Card.Body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: "10px",
          flexGrow: 1,
        }}
      >
        <Card.Title style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {producto.nombre}
        </Card.Title>
      </Card.Body>
    </Card>
  );
};

export default ProductoCard;
