import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { withApollo } from "@apollo/client/react/hoc";
import Chats from "./Chats";
import Feed from "./Feed";
import LoginRegisterForm from "./components/loginRegister";
import "../../assets/css/style.css";
import "./components/fontawesome";
import Bar from "./components/bar";

import { useCurrentUser } from "./apollo/queries/currentUser";
import Loading from "./components/loading";

const App = ({ client }) => {
  const [loggedIn, setLoggedIn] = useState(
    () => !!localStorage.getItem("gb_token")
  );
  const { loading, refetch } = useCurrentUser();
  useEffect(() => {
    const unsubscribe = client.onClearStore(() => {
      if (loggedIn) {
        setLoggedIn(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const handleLogin = (status) => {
    refetch()
      .then(() => {
        setLoggedIn(status);
      })
      .catch(() => {
        setLoggedIn(status);
      });
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="container">
      <Helmet>
        <title>Graphbook - Feed</title>
        <meta
          name="description"
          content="Newsfeed of all
your friends on Graphbook"
        />
      </Helmet>

      {loggedIn && (
        <div>
          <Bar changeLoginState={handleLogin} />
          <Feed />
          <Chats />
        </div>
      )}

      {!loggedIn && <LoginRegisterForm changeLoginState={setLoggedIn} />}
    </div>
  );
};

export default withApollo(App);
