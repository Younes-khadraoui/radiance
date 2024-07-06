import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $email: String!
    $username: String!
    $password: String!
  ) {
    register(
      input: { email: $email, username: $username, password: $password }
    ) {
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      token
    }
  }
`;
