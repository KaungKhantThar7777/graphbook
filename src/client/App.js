import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Chats from "./Chats";
import Feed from "./Feed";
import LoginRegisterForm from "./components/loginRegister";
import "../../assets/css/style.css";
import "./components/fontawesome";
import Bar from "./components/bar";
import { UserProvider } from "./components/context/user";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(
    () => !!localStorage.getItem("gb_token")
  );
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
      <UserProvider>
        {loggedIn && (
          <div>
            <Bar />
            <Feed />
            <Chats />
          </div>
        )}
      </UserProvider>
      {!loggedIn && <LoginRegisterForm changeLoginState={setLoggedIn} />}
    </div>
  );
};

export default App;
