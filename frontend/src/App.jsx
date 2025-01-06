import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Nominees from "./components/Nominees";
import Voting from "./components/Voting";
import Results from "./components/Results";
import "./i18n";
import UserVote from "./components/UserVote";

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/nominees"
          element={
            <PrivateRoute>
              <Nominees />
            </PrivateRoute>
          }
        />
        <Route
          path="/vote"
          element={
            <PrivateRoute>
              <Voting />
            </PrivateRoute>
          }
        />
        <Route
          path="/results"
          element={
            <PrivateRoute>
              <Results />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-vote"
          element={
            <PrivateRoute>
              <UserVote />
            </PrivateRoute>
          }
        ></Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
