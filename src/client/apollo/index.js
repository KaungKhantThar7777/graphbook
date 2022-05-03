import {
  ApolloClient,
  InMemoryCache,
  from,
  HttpLink,
  gql,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";

const AuthLink = (operation, next) => {
  const token = localStorage.getItem("gb_token");
  if (token) {
    operation.setContext((context) => ({
      ...context,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }));
  }
  return next(operation);
};

const client = new ApolloClient({
  link: from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        console.log(graphQLErrors);
        graphQLErrors.map(({ extensions, message, locations, path }) => {
          if (extensions.code === "INTERNAL_SERVER_ERROR") {
            localStorage.removeItem("jwt");
            client.clearStore();
          }
          console.log(`
                    [GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
          if (networkError) {
            console.log(`[Network error]: ${networkError}`);
          }
        });
      }
    }),
    AuthLink,
    createUploadLink({
      uri: "http://localhost:8000/graphql",
      credentials: "same-origin",
    }),
  ]),
  cache: new InMemoryCache(),
});

export default client;
