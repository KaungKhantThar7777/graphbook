import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Chats from "./Chats";
import Feed from "./Feed";
import "../../assets/css/style.css";
import "./components/fontawesome";

const App = () => {
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
      <Feed />
      <Chats />
    </div>
  );
};

export default App;
