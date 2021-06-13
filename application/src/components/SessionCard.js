import React from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function SessionCard(props) {
  return (
    <Card>
      <Card.Header>Status: ?</Card.Header>
      <Card.Body>
        <Card.Title>{props.studentName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Flagged: ?</Card.Subtitle>
        <Card.Text>Flagged data:</Card.Text>
        <Button variant="primary" as={Link} to={`/`}>
          View Frames
        </Button>
        <Button variant="primary">View Misc. Data</Button>
      </Card.Body>
    </Card>
  );
}
