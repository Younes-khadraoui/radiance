import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const authToken = localStorage.getItem("authToken");
const client = new ApolloClient({
  link: new HttpLink({
    uri: `${BACKEND_URL}/graphql`,
    headers: {
      authorization: authToken ? `Bearer ${authToken}` : "",
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
