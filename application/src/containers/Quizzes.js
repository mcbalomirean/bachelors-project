import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { API } from "../util/constants";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import CardGroup from "react-bootstrap/CardGroup";
import QuizCard from "../components/QuizCard";

const config = {
  baseURL: `${API}/reviewing`,
  withCredentials: true,
};

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);

  const handleUpdate = () => {
    axios.get("/", config).then((result) => {
      setQuizzes(result.data);
    });
  };

  useEffect(() => {
    handleUpdate();
  }, []);

  async function handleToggle(quizId) {
    // TODO: handle errors
    axios.put(`/${quizId}`, undefined, config).then(() => {
      // TODO: replace this with static handling
      handleUpdate();
    });
  }

  return (
    <Fragment>
      <Breadcrumb>
        <Breadcrumb.Item active>Quizzes</Breadcrumb.Item>
      </Breadcrumb>
      <CardGroup className="m-3">
        {quizzes.map((quiz, idx) => (
          <QuizCard
            key={idx}
            id={quiz.id}
            platform={quiz.platform}
            isActive={quiz.isActive}
            noStudents={quiz.noStudents}
            handleToggle={handleToggle}
          />
        ))}
      </CardGroup>
    </Fragment>
  );
}
