import React from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function MiscDataCard(props) {
  const { data, handleUnflag } = props;

  return (
    <Card>
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
