import React from "react";
import { API } from "../util/constants";

import Alert from "react-bootstrap/Alert";

export default function LoginAlert() {
  return (
    <Alert variant="info">
      <Alert.Heading>You are not logged in.</Alert.Heading>
      You must be <Alert.Link href={`${API}/auth/login`}>
        logged in
      </Alert.Link>{" "}
      to view Student Monitor data.
    </Alert>
  );
}
