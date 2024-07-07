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

export const JOIN_GROUP = gql`
  mutation JoinGroup($groupName: String!) {
    joinGroup(groupName: $groupName) {
      id
      email
      username
      profilePic
      admin
      token
      joinedGroups
    }
  }
`;

export const QUIT_GROUP = gql`
  mutation QuitGroup($groupName: String!) {
    quitGroup(groupName: $groupName) {
      id
      email
      username
      profilePic
      admin
      token
      joinedGroups
    }
  }
`;

export const GET_GROUP_MEMBERS = gql`
  query GetGroupMembers($groupName: String!) {
    getGroupMembers(groupName: $groupName) {
      id
      username
      profilePic
      online
    }
  }
`;

export const UPDATE_PROFILE_PICTURE = gql`
  mutation UpdateProfilePicture($profilePic: String!) {
    updateProfilePicture(profilePic: $profilePic) {
      id
      email
      username
      profilePic
      admin
      joinedGroups
      online
    }
  }
`;

export const FETCH_USER = gql`
  query {
    account {
      email
      profilePic
      admin
      username
      joinedGroups
    }
  }
`;