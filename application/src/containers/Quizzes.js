import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { API } from "../util/constants";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import Button from "react-bootstrap/Button";
import CardDeck from "react-bootstrap/CardDeck";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import QuizCard from "../components/QuizCard";

const config = {
  baseURL: `${API}/reviewing`,
  withCredentials: true,
};

const initialCreateModalFormState = {
  id: "",
  platform: "",
};

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalForm, setCreateModalForm] = useState(
    initialCreateModalFormState
  );

  const handleSearchBarChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleUpdate = () => {
    axios.get("/", config).then((result) => {
      setQuizzes(result.data);
    });
  };

  const handleToggleQuiz = (quizId) => {
    const body = { id: quizId };
    // TODO: handle errors
    axios.put(`/`, body, config).then(() => {
      handleUpdate();
    });
  };

  const handleShowCreateModal = () => {
    setCreateModalForm(initialCreateModalFormState);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateQuiz = () => {
    if (createModalForm.id === "" || createModalForm.platform === "") {
      return;
    }

    axios.post(`/`, createModalForm, config).then(() => {
      handleUpdate();
    });

    setShowCreateModal(false);
  };

  const handleModalInputChange = (event) => {
    setCreateModalForm((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    handleUpdate();
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      setFilteredQuizzes([]);
    } else {
      setFilteredQuizzes(
        quizzes.filter((quiz) => {
          return (
            quiz.id.toString().includes(searchValue) ||
            quiz.platform.includes(searchValue)
          );
        })
      );
    }
  }, [quizzes, searchValue]);

  return (
    <Fragment>
      <Navbar bg="light" expand="md">
        <Nav>
          <Breadcrumb listProps={{ className: "mb-0" }} className="mb-0">
            <Breadcrumb.Item active>Quizzes</Breadcrumb.Item>
          </Breadcrumb>
        </Nav>
        <Navbar.Toggle aria-controls="controls-nav" />
        <Navbar.Collapse id="controls-nav">
          <Form
            inline
            className="ml-auto"
            onSubmit={(event) => {
              event.preventDefault();
              return false;
            }}
          >
            <FormControl
              type="text"
              placeholder="Search..."
              className="my-2 my-md-0 mr-md-2"
              value={searchValue}
              onChange={handleSearchBarChange}
            />
            <Button
              variant="secondary"
              className="ml-auto"
              onClick={handleShowCreateModal}
            >
              Create Quiz
            </Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <CardDeck className="m-0">
        {filteredQuizzes.length > 0
          ? filteredQuizzes.map((quiz, idx) => (
              <QuizCard key={idx} quiz={quiz} handleToggle={handleToggleQuiz} />
            ))
          : quizzes.map((quiz, idx) => (
              <QuizCard key={idx} quiz={quiz} handleToggle={handleToggleQuiz} />
            ))}
      </CardDeck>

      <Modal centered show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            inline
            noValidate
            validated
            onSubmit={(event) => {
              event.preventDefault();
              return false;
            }}
          >
            <FormControl
              type="text"
              name="id"
              placeholder="Id..."
              value={createModalForm.id}
              onChange={handleModalInputChange}
              className="w-100 mb-2"
              required
            />
            <FormControl
              type="text"
              name="platform"
              placeholder="Platform..."
              value={createModalForm.platform}
              onChange={handleModalInputChange}
              className="w-100"
              required
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateQuiz}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
