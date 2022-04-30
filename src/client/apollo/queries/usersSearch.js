import { gql, useQuery } from "@apollo/client";
import { USER_ATTRIBUTES } from "../fragments/userAttributes";

export const SEARCH_USERS = gql`
  query usersSearch($text: String!, $page: Int, $limit: Int) {
    usersSearch(text: $text, page: $page, limit: $limit) {
      users {
        id
        ...userAttributes
      }
    }
  }
  ${USER_ATTRIBUTES}
`;

export const getUsersSearchConfig = (text) => ({
  variables: {
    limit: 5,
    page: 0,
    text,
  },
  skip: text.length < 3,
});

export const useUserSearchQuery = (text) =>
  useQuery(SEARCH_USERS, getUsersSearchConfig(text));
