import { gql, useQuery } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      id
      username
      avatar
    }
  }
`;

export const useCurrentUser = (options) => useQuery(GET_CURRENT_USER, options);
