import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API } from "../util/constants";

import Alert from "react-bootstrap/Alert";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import CardDeck from "react-bootstrap/CardDeck";
import MiscDataCard from "../components/MiscDataCard";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const config = {
  baseURL: `${API}/reviewing`,
  withCredentials: true,
};

export default function Quizzes() {
  let { quizId, sessionId } = useParams();

  const [miscData, setMiscData] = useState([]);

  const handleUpdate = () => {
    axios.get(`/${sessionId}/behavior`, config).then((result) => {
      setMiscData(result.data);
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
      <Navbar bg="light" expand="md">
        <Nav>
          <Breadcrumb listProps={{ className: "mb-0" }} className="mb-0">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Quizzes
            </Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/${quizId}` }}>
              Quiz #{quizId}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Misc. Data</Breadcrumb.Item>
            <Breadcrumb.Item active>Session #{sessionId}</Breadcrumb.Item>
          </Breadcrumb>
        </Nav>
      </Navbar>
      {miscData.length > 0 ? (
        <CardDeck className="m-0">
          {miscData.map((data, idx) => (
            <MiscDataCard key={idx} data={data} handleUnflag={handleUnflag} />
          ))}
        </CardDeck>
      ) : (
        <Alert variant="info">
          <Alert.Heading>No data.</Alert.Heading>
          This session has no flagged miscellaneous data.
        </Alert>
      )}
    </Fragment>
  );
}
