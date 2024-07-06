import { gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    username: String!
    profilePic: String
    admin: Boolean
    token: String
  }

  type AuthPayload {
    token: String
    user: User
  }

  input RegisterInput {
    email: String!
    username: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    account: User
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload
    login(input: LoginInput!): AuthPayload
  }
`;

export default typeDefs;
