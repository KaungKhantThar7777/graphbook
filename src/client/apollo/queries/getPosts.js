import { gql } from "@apollo/client";
import { USER_ATTRIBUTES } from "../fragments/userAttributes";

export const GET_POSTS = gql`
  query postsFeed($page: Int, $limit: Int) {
    postsFeed(page: $page, limit: $limit) {
      posts {
        id
        text
        user {
          ...userAttributes
        }
      }
    }
  }
  ${USER_ATTRIBUTES}
`;
