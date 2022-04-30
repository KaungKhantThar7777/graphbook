import React, { useState } from "react";
import { useLoginMutation } from "../apollo/mutations/login";
import Loading from "./loading";
import Error from "./error";
import { useSignupMutation } from "../apollo/mutations/signup";

const Form = ({ changeLoginState, isLogin }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error }] = isLogin
    ? useLoginMutation()
    : useSignupMutation();

  const onSubmit = (event) => {
    event.preventDefault();
    login({
      variables: { email, password, ...(!isLogin && { username }) },
      update(cache, { data }) {
        const token = data.login?.token || data.signup?.token;
        if (token) {
          localStorage.setItem("gb_token", token);
          changeLoginState(true);
        }
      },
    });
  };

  return (
    <div className="login">
      {!loading && (
        <form onSubmit={onSubmit}>
          <label>Email</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} />

          {!isLogin && (
            <>
              <label>Username</label>
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
              />
            </>
          )}

          <label>Password</label>
          <input
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />

          <button type="submit">{isLogin ? "Login" : "Sign up"}</button>
        </form>
      )}
      {loading && <Loading />}
      {error && (
        <Error>
          <p>There was an error logging in!</p>
        </Error>
      )}
    </div>
  );
};

const LoginRegisterForm = ({ changeLoginState }) => {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div className="authModal">
      <div>
        <Form isLogin={showLogin} changeLoginState={changeLoginState} />
        <a
          style={{ cursor: "pointer" }}
          onClick={() => setShowLogin(!showLogin)}
        >
          Want to {showLogin ? "login" : "sign up"}? Click here
        </a>
      </div>
    </div>
  );
};
export default LoginRegisterForm;
