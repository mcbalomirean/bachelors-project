import React from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function SessionCard(props) {
  const { session } = props;

  return (
    <Card
      border={session.noFlaggedData ? "danger" : "secondary"}
      style={{ flex: "1 1 30%", maxWidth: "33%" }}
      className="m-3"
    >
      <Card.Header
        className={session.noFlaggedData ? "bg-danger text-light" : ""}
      >
        {session.noFlaggedData ? "Suspicious" : "OK"}
      </Card.Header>
      <Card.Body>
        <Card.Title>{session.StudentName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {session.noFlaggedData} flagged items.
        </Card.Subtitle>
        <Card.Text>
          {session.noFlaggedFrames} frame(s), {session.noFlaggedMiscData} misc.
          data.
        </Card.Text>
        <Button
          variant="primary"
          as={Link}
          to={`/${session.QuizId}/frames/${session.id}`}
          className="mr-1"
        >
          View Frames
        </Button>
        <Button
          variant="primary"
          as={Link}
          to={`/${session.QuizId}/misc/${session.id}`}
          className="ml-1"
        >
          View Misc. Data
        </Button>
      </Card.Body>
    </Card>
  );
}
