import { gql } from "@apollo/client";

export const POST_LOGIN = gql`
  mutation execLogin($input: LoginInput) {
    login(input: $input) {
      token
      user {
        id
        firstName
        lastName
        role
      }
    }
  }
`;
