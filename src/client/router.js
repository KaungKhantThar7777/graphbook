import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import LoginRegisterForm from "./components/loginRegister";
import Main from "./Main";
import User from "./User";

const Router = ({ changeLoginState, loggedIn }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/app"
          element={
            <PrivateRoute loggedIn={loggedIn}>
              <Main changeLoginState={changeLoginState} />
            </PrivateRoute>
          }
        />

        <Route
          index
          path="/"
          element={
            <LoginRoute loggedIn={loggedIn}>
              <LoginRegisterForm changeLoginState={changeLoginState} />
            </LoginRoute>
          }
        />
        <Route
          path="/user/:username"
          element={
            // <h1>hello</h1>
            <PrivateRoute loggedIn={loggedIn}>
              <User changeLoginState={changeLoginState} />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

const LoginRoute = ({ children, loggedIn }) => {
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();
  return loggedIn ? (
    <Navigate to={location?.state?.["from"] || "/app"} />
  ) : (
    children
  );
};

const PrivateRoute = ({ children, loggedIn }) => {
  let location = useLocation();

  return loggedIn ? (
    children
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default Router;
