import {
  ApolloClient,
  InMemoryCache,
  from,
  HttpLink,
  gql,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

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
        graphQLErrors.map(({ message, locations, path }) => {
          if (extensions.code === "UNAUTHENTICATED") {
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
    new HttpLink({
      uri: "http://localhost:8000/graphql",
    }),
  ]),
  cache: new InMemoryCache(),
});

export default client;
