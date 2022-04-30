import React from "react";
import { UserConsumer } from "../context/user";
import SearchBar from "./search";
import UserBar from "./user";

const Bar = () => {
  return (
    <div className="topbar">
      <div className="inner">
        <SearchBar />
        <UserConsumer>
          <UserBar />
        </UserConsumer>
      </div>
    </div>
  );
};

export default Bar;
