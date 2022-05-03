import React from "react";

import { ApolloConsumer } from "@apollo/client";
import { GET_CURRENT_USER } from "../../apollo/queries/currentUser";

export const UserConsumer = ({ children }) => (
  <ApolloConsumer>
    {(client) => {
      const result = client.readQuery({
        query: GET_CURRENT_USER,
      });

      // client.readQuery

      return React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          user: result?.currentUser ? result.currentUser : null,
        });
      });
    }}
  </ApolloConsumer>
);
