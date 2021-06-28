import { Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import FrameView from "./FrameView";
import MiscDataView from "./MiscDataView";
import LoginAlert from "../components/LoginAlert";
import Quizzes from "./Quizzes";
import Quiz from "./Quiz";
import { useAuth } from "../hooks/useAuth";

export default function App() {
  const auth = useAuth();

  return (
    <Fragment>
      {auth.user ? (
        <Switch>
          <Route path="/:quizId/frames/:sessionId">
            <FrameView />
          </Route>
          <Route path="/:quizId/misc/:sessionId">
            <MiscDataView />
          </Route>
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
