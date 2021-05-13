import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

function Keyword({ name, count }) {
  return (
      <Card>
        <Card.Body className="d-flex justify-content-center align-items-center-center">
          <Badge>{name}</Badge>
        </Card.Body>
        <Card.Footer className="text-center text-muted">
          <small>{count} questions</small>
        </Card.Footer>
      </Card>
  );
}

export default Keyword;
