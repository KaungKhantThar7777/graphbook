import { gql, useMutation } from "@apollo/client";

export const SIGNUP = gql`
  mutation signup($email: String!, $username: String!, $password: String!) {
    signup(email: $email, username: $username, password: $password) {
      token
    }
  }
`;

export const useSignupMutation = () => useMutation(SIGNUP);
