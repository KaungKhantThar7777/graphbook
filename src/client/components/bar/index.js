import React from "react";
import { useNavigate } from "react-router-dom";
import { UserConsumer } from "../context/user";
import Logout from "./logout";
import SearchBar from "./search";
import UserBar from "./user";

const Bar = ({ changeLoginState }) => {
  const navigate = useNavigate();
  return (
    <div className="topbar">
      <div className="inner">
        <SearchBar />
        <UserConsumer>
          <UserBar />
        </UserConsumer>
      </div>
      <div className="buttons">
        <button
          onClick={() => {
            navigate("/app");
          }}
        >
          Home
        </button>
        <Logout changeLoginState={changeLoginState} />
      </div>
    </div>
  );
};

export default Bar;
