import React, { createContext } from "react";
const { Provider } = createContext();
import { ApolloConsumer } from "@apollo/client";

export const UserProvider = ({ children }) => {
  const user = {
    username: "Kaung Khant Thar",
    avatar: "/uploads/avatar1..png",
  };

  return <Provider value={user}>{children}</Provider>;
};

export const UserConsumer = ({ children }) => (
  <ApolloConsumer>
    {(client) => {
      // client.readQuery
      const user = {
        username: "Kaung Khant Thar",
        avatar: "/uploads/avatar1.png",
      };
      return React.Children.map(children, (child) => {
        return React.cloneElement(child, { user });
      });
    }}
  </ApolloConsumer>
);
