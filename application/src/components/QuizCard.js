import React from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function QuizCard(props) {
  const { handleToggle, quiz } = props;

  return (
    <Card border={quiz.isActive ? "primary" : "secondary"}>
      <Card.Header className={quiz.isActive ? "bg-primary text-light" : ""}>
        {quiz.isActive ? "Active" : "Inactive"}
      </Card.Header>
      <Card.Body>
        <Card.Title>Id: {quiz.id}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Platform: {quiz.platform}
        </Card.Subtitle>
        <Card.Text>{quiz.noStudents} student sessions.</Card.Text>
        <Button variant="primary" as={Link} to={`/${quiz.id}`} className="mr-1">
          View
        </Button>
        {quiz.isActive ? (
          <Button
            variant="primary"
            onClick={() => {
              handleToggle(quiz.id);
            }}
            className="ml-1"
          >
            Disable
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => {
              handleToggle(quiz.id);
            }}
            className="ml-1"
          >
            Enable
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
