import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API } from "../util/constants";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import CardGroup from "react-bootstrap/CardGroup";
import SessionCard from "../components/SessionCard";

const config = {
  baseURL: `${API}/reviewing`,
  withCredentials: true,
};

export default function Quiz(props) {
  let { id } = useParams();

  const [sessions, setSessions] = useState([]);

  const handleUpdate = () => {
    axios.get(`/${id}`, config).then((result) => {
      setSessions(result.data);
    });
  };

  useEffect(() => {
    handleUpdate();
  }, []);

  return (
    <Fragment>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Quizzes
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Quiz #{id}</Breadcrumb.Item>
      </Breadcrumb>
      <CardGroup className="m-3">
        {sessions.map((session, idx) => (
          <SessionCard
            key={idx}
            id={session.id}
            quizId={session.QuizId}
            studentName={session.StudentName}
            isFlagged={session.isFlagged}
          />
        ))}
      </CardGroup>
    </Fragment>
  );
}
