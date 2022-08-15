import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { FiEdit } from "react-icons/fi";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { GrTechnology } from "react-icons/gr";
import Openstack from "@assets/openstack.svg";
import VMware from "@assets/vmware.svg";

// component
import graph from "@assets/graph.svg";
import EditHypervisorCard from "./EditHypervisorCard";
import oval from "@assets/oval.svg";

export default function RegionCard({ item, reload }) {
  const [editZone, setEditZone] = useState(false);

  return (
    <>
      {editZone ? (
        <EditHypervisorCard
          close={() => {
            setEditZone(false);
            reload();
          }}
          title="Edit Region"
          idHyper={item.id}
          nameData={item.name}
          regionData={item.region.id}
          zoneData={item.zone.id}
          storageData={item.storage}
          cpuData={item.cpu}
          memoryData={item.memory}
          endpointData={item.endpoint}
          descData={item.description}
        />
      ) : (
        <></>
      )}

      <div
        style={{
          width: "23.5%",
          border: "solid 1px #E0E0E0",
          borderRadius: "5px",
          backgroundColor: "rgba(238, 182, 40, 0.15)",
          backgroundImage: `url(${oval})`,
          backgroundPosition: "100px 50%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "20rem",
          boxSizing: "border-box",
          padding: "1rem",
          marginBottom: "1rem",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <FiEdit
          onClick={() => setEditZone(true)}
          style={{
            fontSize: "1.25rem",
            cursor: "pointer",
            position: "absolute",
            top: 5,
            right: 10,
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <img
            src={graph}
            alt={graph}
            style={{
              height: "1.75rem",
            }}
          />
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {item.name}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <MapOutlinedIcon
            sx={{
              fontSize: "1.75rem",
            }}
          />
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {`Zone : ${item.zone.name}`}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            marginTop: "0.25rem",
            marginBottom: "0.5rem",
          }}
        >
          {item.vendor === "vmware" ? (
            <img
              src={VMware}
              alt={VMware}
              style={{
                height: "1.5rem",
              }}
            />
          ) : (
            <img
              src={Openstack}
              alt={Openstack}
              style={{
                height: "2rem",
              }}
            />
          )}
          {/* <GrTechnology
            style={{
              fontSize: "1.75rem",
            }}
          />
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            {`Vendor : ${item.vendor}`}
          </Typography> */}
        </Box>
      </div>
    </>
  );
}
