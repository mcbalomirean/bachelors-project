import React from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { API } from "../util/constants";

export default function FrameCard(props) {
  const { frame, handleUnflag } = props;
  const date = new Date(parseInt(frame.path.match(/\d+/)[0]));

  return (
    <Card>
      <Card.Header>{date.toUTCString()}</Card.Header>
      <Card.Img variant="top" src={`${API}/sessions/${frame.path}`} />
      <Card.Body>
        <Card.Title className="mb-3">{frame.reason}</Card.Title>
        <Button
          variant="primary"
          onClick={() => {
            handleUnflag(frame.id);
          }}
        >
          Unflag
        </Button>
      </Card.Body>
    </Card>
  );
}
