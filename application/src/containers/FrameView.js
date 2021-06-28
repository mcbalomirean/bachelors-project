import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API } from "../util/constants";

import Alert from "react-bootstrap/Alert";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import CardColumns from "react-bootstrap/CardColumns";
import FrameCard from "../components/FrameCard";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const config = {
  baseURL: `${API}/reviewing`,
  withCredentials: true,
};

export default function Quizzes() {
  let { quizId, sessionId } = useParams();

  const [frames, setFrames] = useState([]);

  const handleUpdate = () => {
    axios.get(`/${sessionId}/frame`, config).then((result) => {
      setFrames(result.data);
    });
  };

  const handleUnflag = (dataId) => {
    axios.delete(`/${dataId}`, config).then((result) => {
      handleUpdate();
    });
  };

  useEffect(() => {
    handleUpdate();
  }, []);

  return (
    <Fragment>
      <Navbar bg="light" expand="lg">
        <Nav>
          <Breadcrumb listProps={{ className: "mb-0" }} className="mb-0">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Quizzes
            </Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/${quizId}` }}>
              Quiz #{quizId}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Frames</Breadcrumb.Item>
            <Breadcrumb.Item active>Session #{sessionId}</Breadcrumb.Item>
          </Breadcrumb>
        </Nav>
      </Navbar>
      {frames.length > 0 ? (
        <CardColumns className="m-3">
          {frames.map((frame, idx) => (
            <FrameCard key={idx} frame={frame} handleUnflag={handleUnflag} />
          ))}
        </CardColumns>
      ) : (
        <Alert variant="info">
          <Alert.Heading>No data.</Alert.Heading>
          This session has no flagged video frames.
        </Alert>
      )}
    </Fragment>
  );
}
