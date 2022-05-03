import React from "react";
import UserProfile from "./components/user";
import Chats from "./Chats";
import Bar from "./components/bar";
import { useParams } from "react-router-dom";

export const User = ({ changeLoginState }) => {
  console.log(params, "here");
  const params = useParams();
  return (
    <>
      <Bar changeLoginState={changeLoginState} />
      <UserProfile username={params.username} />
      <Chats />
    </>
  );
};

export default User;
