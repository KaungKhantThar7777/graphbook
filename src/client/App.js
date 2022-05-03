import { withApollo } from "@apollo/client/react/hoc";
import "cropperjs/dist/cropper.css";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Router from "./router";
import "../../assets/css/style.css";
import { useCurrentUser } from "./apollo/queries/currentUser";
import "./components/fontawesome";
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

      <Router loggedIn={loggedIn} changeLoginState={handleLogin} />
      {/* {loggedIn && (
        <div>
          <Bar changeLoginState={handleLogin} />
          <Feed />
          <Chats />
        </div>
      )}

      {!loggedIn && <LoginRegisterForm changeLoginState={setLoggedIn} />} */}
    </div>
  );
};

export default withApollo(App);
