import { gql } from "@apollo/client";

export const GET_VOLUMES = gql`
  query ($limit: Int, $skip: Int, $or: [VolumeFilter]) {
    volumesConnection(
      limit: $limit
      skip: $skip
      where: { vendor_not: "vmware" }
      or: $or
      orderBy: updatedAt_DESC
    ) {
      total
      data {
        id
        region {
          id
          name
        }
        zone {
          id
          name
        }
        hypervisor {
          id
          name
        }
        size
        status
        type
        attachTo
        createdBy {
          id
          firstName
          lastName
        }
        project {
          id
          name
        }
        instance {
          id
          name
        }
      }
    }
  }
`;

export const OPENSTACK_VOLUME = gql`
  query OpenstackVolume($limit: Int, $skip: Int, $or: [OpenStackVolumeFilter]) {
    openStackVolumesConnection(
      limit: $limit
      skip: $skip
      or: $or
      where: { openStackInstance: { name_contains: "" } }
      orderBy: updatedAt_DESC
    ) {
      total
      data {
        id
        name
        openStackInstance {
          name

          id
          name
          project {
            id
            name
            createdBy {
              id
              firstName
              lastName
            }
            updatedBy {
              id
              firstName
              lastName
            }
            assignUser {
              id
              firstName
              lastName
            }
            hypervisor {
              name
              region {
                id
                name
              }
              zone {
                id
                name
              }
            }
          }
        }
        size
        status
      }
    }
  }
`;

export const VMWARE_VOLUME = gql`
  query VMWareVolume($limit: Int, $skip: Int, $or: [VmwareVolumeFilter]) {
    vmwareVolumesConnection(
      limit: $limit
      skip: $skip
      or: $or
      orderBy: updatedAt_DESC
    ) {
      total
      data {
        id
        name
        size
        status
        vmwares {
          id
          name
          vmId
          memory
          cpu
          storage
          ipAddress
          project {
            name
            hypervisor {
              name
              zone {
                name
                region {
                  name
                }
              }
            }
            updatedBy {
              id
              firstName
              lastName
            }
          }
          operatingSystem {
            id
            operatingSystem {
              name
            }
            version
            imageId
          }
          state
          createdBy {
            firstName
            lastName
          }
          createdAt
        }
      }
    }
  }
`;

export const VM_VOLUME = gql`
  query VmwareInstance($limit: Int, $skip: Int, $or: [VolumeFilter]) {
    volumesConnection(
      limit: $limit
      skip: $skip
      or: $or
      where: { vendor: "vmware" }
      orderBy: updatedAt_DESC
    ) {
      total
      data {
        vendor
        region {
          name
        }
        zone {
          name
        }
        name
        hypervisor {
          name
        }
        project {
          name
        }
        instance {
          name
          client {
            name
          }
        }
        createdBy {
          id
          firstName
          lastName
        }
        size
        status
        type
        attachTo
      }
    }
  }
`;
