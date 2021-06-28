import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API } from "../util/constants";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import CardDeck from "react-bootstrap/CardDeck";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import SessionCard from "../components/SessionCard";

const config = {
  baseURL: `${API}/reviewing`,
  withCredentials: true,
};

export default function Quiz(props) {
  let { id } = useParams();

  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchBarChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleUpdate = () => {
    axios.get(`/${id}`, config).then((result) => {
      setSessions(result.data);
    });
  };

  useEffect(() => {
    handleUpdate();
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      setFilteredSessions([]);
    } else {
      setFilteredSessions(
        sessions.filter((session) => {
          return session.StudentName.includes(searchValue);
        })
      );
    }
  }, [sessions, searchValue]);

  return (
    <Fragment>
      <Navbar bg="light" expand="md">
        <Nav>
          <Breadcrumb listProps={{ className: "mb-0" }} className="mb-0">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Quizzes
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Quiz #{id}</Breadcrumb.Item>
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
              value={searchValue}
              onChange={handleSearchBarChange}
              className="my-2 my-md-0"
            />
          </Form>
        </Navbar.Collapse>
      </Navbar>

      <CardDeck className="m-0">
        {filteredSessions.length > 0
          ? filteredSessions.map((session, idx) => (
              <SessionCard key={idx} session={session} />
            ))
          : sessions.map((session, idx) => (
              <SessionCard key={idx} session={session} />
            ))}
      </CardDeck>
    </Fragment>
  );
}
