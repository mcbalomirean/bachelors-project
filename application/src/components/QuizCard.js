import React from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function QuizCard(props) {
  return (
    <Card border={props.isActive ? "primary" : "secondary"}>
      <Card.Header className={props.isActive ? "bg-primary text-light" : ""}>
        {props.isActive ? "Active" : "Inactive"}
      </Card.Header>
      <Card.Body>
        <Card.Title>Id: {props.id}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Platform: {props.platform}
        </Card.Subtitle>
        <Card.Text>{props.noStudents} student sessions.</Card.Text>
        <Button variant="primary" as={Link} to={`/${props.id}`}>
          View
        </Button>
        {props.isActive ? (
          <Button
            variant="primary"
            onClick={() => {
              props.handleToggle(props.id);
            }}
          >
            Disable
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => {
              props.handleToggle(props.id);
            }}
          >
            Enable
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
