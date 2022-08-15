import { gql } from "@apollo/client";

export const GET_ZONE = gql`
  query {
    regions {
      id
      name
      zones {
        id
        name
        location
        description
      }
    }
  }
`;

export const SPECIFIC_ZONE = gql`
  query getZone($where: ZoneFilter) {
    zones(where: $where) {
      id
      name
    }
  }
`;

export const CREATE_ZONE = gql`
  mutation createZoneInput($input: CreateZoneInput!) {
    createZone(input: $input) {
      id
      name
      location
      description
    }
  }
`;

export const UPDATE_ZONE = gql`
  mutation updateZoneInput($id: String!, $input: UpdateZoneInput!) {
    updateZone(id: $id, input: $input) {
      id
      name
      location
      description
    }
  }
`;
