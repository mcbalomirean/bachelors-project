import { Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import Quizzes from "./Quizzes";
import Quiz from "./Quiz";
import { useAuth } from "../hooks/useAuth";
import LoginAlert from "../components/LoginAlert";

export default function App() {
  const auth = useAuth();

  return (
    <Fragment>
      {auth.user ? (
        <Switch>
          <Route path=":quizId/frames/:sessionId"></Route>
          <Route path="/:id">
            <Quiz />
          </Route>
          <Route path="/">
            <Quizzes />
          </Route>
        </Switch>
      ) : (
        <LoginAlert />
      )}
    </Fragment>
  );
}
