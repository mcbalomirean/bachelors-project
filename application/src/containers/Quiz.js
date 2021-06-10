import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API } from "../util/constants";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import CardGroup from "react-bootstrap/CardGroup";
import StudentCard from "../components/StudentCard";

const config = {
  baseURL: `${API}/quiz`,
};

export default function Quiz(props) {
  let { id } = useParams();

  const [students, setStudents] = useState([]);

  const handleUpdate = () => {
    axios.get(`/${id}`, config).then((result) => {
      setStudents(result.data);
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
        <Breadcrumb.Item active>Quiz {id}</Breadcrumb.Item>
      </Breadcrumb>
      <CardGroup className="m-3">
        {students.map((student, idx) => (
          <StudentCard
            key={idx}
            id={student.Session.id}
            quizId={student.Session.QuizId}
            studentName={student.Session.StudentName}
            isFlagged={student.Session.isFlagged}
          />
        ))}
      </CardGroup>
    </Fragment>
  );
}
