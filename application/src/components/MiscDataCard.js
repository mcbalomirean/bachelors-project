import React from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function MiscDataCard(props) {
  const { data, handleUnflag } = props;

  return (
    <Card style={{ flex: "1 1 30%", maxWidth: "33%" }} className="m-3">
      <Card.Body>
        <Card.Title className="mb-3">{data.reason}</Card.Title>
        <Button
          variant="primary"
          onClick={() => {
            handleUnflag(data.id);
          }}
        >
          Unflag
        </Button>
      </Card.Body>
    </Card>
  );
}
