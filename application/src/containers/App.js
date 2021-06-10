import { Switch, Route } from "react-router-dom";
import Quizzes from "./Quizzes";
import Quiz from "./Quiz";

export default function App() {
  return (
    <Switch>
      <Route path="/:id">
        <Quiz />
      </Route>
      <Route path="/">
        <Quizzes />
      </Route>
    </Switch>
  );
}
