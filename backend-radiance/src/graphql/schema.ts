import { gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    username: String!
    profilePic: String
    admin: Boolean
    token: String
    joinedGroups: [String]
    online: Boolean 
  }

  type Group {
    id: ID!
    name: String!
    users: [User!]!
    messages: [Message!]!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Message {
    user: User!
    message: String!
    timestamp: String!
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
    getGroupMembers(groupName: String!): [User!]!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload
    login(input: LoginInput!): AuthPayload
    joinGroup(groupName: String!): User
    createGroup(groupName: String!): Group
    quitGroup(groupName: String!): User
    updateProfilePicture(profilePic: String!): User
  }
`;

export default typeDefs;
