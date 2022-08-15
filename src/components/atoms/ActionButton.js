import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { UPDATE_VM_STATUS } from "@utils/gql/instance/constant";
import { useMutation } from "@apollo/client";
import DeleteInstanceOp from "@components/molecules/DeleteInstanceOp";
import { makeStyles } from "@mui/styles";
import { CircularProgress } from "@mui/material";

const useStyles = makeStyles({
  select: {
    "&:before": {
      borderColor: "white",
    },
    "&:after": {
      borderColor: "white",
    },
    "&:not(.Mui-disabled):hover::before": {
      borderColor: "white",
    },
  },
  icon: {
    fill: "white",
  },
  root: {
    color: "white",
  },
});

export default function ActionButton({ data, refetch }) {
  const [actButton, setActButton] = useState(data?.state);
  const [isLoadingOn, setIsLoadingOn] = useState(false);
  const [isLoadingOff, setIsLoadingOff] = useState(false);
  const [isLoadingSoftReboot, setIsLoadingSoftReboot] = useState(false);
  const [isLoadingHardReboot, setIsLoadingHardReboot] = useState(false);
  const [deleteInstance, setDeleteInstance] = useState(false);

  const handleChange = (e) => {
    setActButton(e.target.value);
    if (e.target.value === "POWER_ON") {
      handlePowerOn();
    } else if (e.target.value === "POWER_OFF") {
      handlePowerOff();
    } else if (e.target.value === "Soft Reboot") {
      handleSoftReboot();
    } else if (e.target.value === "Reboot") {
      handleHardReboot();
    } else if (e.target.value === "Delete") {
      setDeleteInstance(true);
      setActButton(data.state);
    } else if (e.target.value === "Console") {
      setActButton("POWER_ON");
      handleConsole();
    }
  };

  const ENDPOINT = process.env.OPENSTACK_ENDPOINT;

  const [updatePowerStatus, { loading }] = useMutation(UPDATE_VM_STATUS);

  const handleConsole = async () => {
    let response = await axios.post(
      `https://dev-khayanganjxhpv.microgen.id/function/os-instance-console`,
      {
        mgInstanceId: data.id,
      }
    );
    window.open(response.data.data.console.url, "_blank");
  };

  const handlePowerOn = async () => {
    setIsLoadingOn(true);
    try {
      await axios.post(
        `https://dev-khayanganjxhpv.microgen.id/function/os-instance-power`,
        {
          mgInstanceId: data.id,
          state: "on",
        }
      );
      setTimeout(() => {
        setIsLoadingOn(false);
        refetch();
      }, 1000 * 5);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePowerOff = async () => {
    setIsLoadingOff(true);
    try {
      await axios.post(
        `https://dev-khayanganjxhpv.microgen.id/function/os-instance-power`,
        {
          mgInstanceId: data.id,
          state: "off",
        }
      );
      setTimeout(() => {
        setIsLoadingOff(false);
        refetch();
      }, 1000 * 5);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSoftReboot = async () => {
    setIsLoadingSoftReboot(true);
    try {
      let response = await axios.post(
        `https://dev-khayanganjxhpv.microgen.id/function/os-instance-reboot`,
        {
          mgInstanceId: data.id,
          type: "soft",
        }
      );

      console.log(response);
      if (response) {
        setIsLoadingSoftReboot(false);
      }
      // setTimeout(() => {
      //   setIsLoadingSoftReboot(false);
      //   refetch();
      // }, 1000 * 5);
    } catch (error) {
      console.log(error);
    }
  };

  const handleHardReboot = async () => {
    setIsLoadingHardReboot(true);
    try {
      let response = await axios.post(
        `https://dev-khayanganjxhpv.microgen.id/function/os-instance-reboot`,
        {
          mgInstanceId: data.id,
          type: "hard",
        }
      );
      console.log(response);
      if (response) {
        setIsLoadingHardReboot(false);
        refetch();
      }

      // setTimeout(() => {
      //   setIsLoadingHardReboot(false);
      //   refetch();
      // }, 1000 * 5);
    } catch (error) {
      console.log(error);
    }
  };

  const token = window.localStorage.getItem("factory-token");

  const handleDelete = async () => {
    try {
      let response = await axios.post(
        `https://dev-khayanganjxhpv.microgen.id/function/os-instance-delete`,
        {
          mgInstanceId: data.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const classes = useStyles();

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size="small">
        {actButton === "POWER_OFF" ? (
          <Select
            value={actButton}
            displayEmpty
            className={classes.select}
            inputProps={{
              "aria-label": "Without label",
              classes: {
                icon: classes.icon,
                root: classes.root,
              },
            }}
            label="Action"
            onChange={handleChange}
            variant="standard"
            disableUnderline
            sx={{ bgcolor: "black", color: "white", px: 1, borderRadius: 1 }}
          >
            <MenuItem value="POWER_OFF" disabled>
              {isLoadingOff ? (
                <div style={{ display: "flex" }}>
                  <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  <p style={{ marginLeft: "0.5rem", color: "white" }}>
                    Turning Off
                  </p>
                </div>
              ) : (
                "Power Off"
              )}
            </MenuItem>
            <MenuItem value="POWER_ON">
              {isLoadingOn ? (
                <div style={{ display: "flex" }}>
                  <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  <p style={{ marginLeft: "0.5rem", color: "white" }}>
                    Turning On
                  </p>
                </div>
              ) : (
                "Power On"
              )}
            </MenuItem>
            <MenuItem value="Delete">Delete</MenuItem>
          </Select>
        ) : (
          <Select
            value={actButton}
            displayEmpty
            className={classes.select}
            inputProps={{
              "aria-label": "Without label",
              classes: {
                icon: classes.icon,
                root: classes.root,
              },
            }}
            label="Action"
            onChange={handleChange}
            variant="standard"
            disableUnderline
            sx={{ bgcolor: "black", color: "white", px: 1, borderRadius: 1 }}
          >
            <MenuItem value="POWER_ON" disabled>
              {isLoadingOn ? (
                <div style={{ display: "flex" }}>
                  <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  <p style={{ marginLeft: "0.5rem", color: "white" }}>
                    Turning On
                  </p>
                </div>
              ) : (
                "Power On"
              )}
            </MenuItem>
            <MenuItem value="POWER_OFF">
              {isLoadingOff ? (
                <div style={{ display: "flex" }}>
                  <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  <p style={{ marginLeft: "0.5rem", color: "white" }}>
                    Turning On
                  </p>
                </div>
              ) : (
                "Power Off"
              )}
            </MenuItem>
            {/* <MenuItem value="Soft Reboot">
              {isLoadingSoftReboot ? <CircularProgress /> : "Soft Reboot"}
            </MenuItem> */}
            <MenuItem value="Reboot">
              {isLoadingHardReboot ? <CircularProgress /> : "Reboot"}
            </MenuItem>
            <MenuItem value="Delete">Delete</MenuItem>
            <MenuItem value="Console">Console</MenuItem>
          </Select>
        )}
      </FormControl>
      {deleteInstance ? (
        <DeleteInstanceOp
          handleDelete={handleDelete}
          close={() => {
            setDeleteInstance(false);
          }}
        />
      ) : null}
    </Box>
  );
}
