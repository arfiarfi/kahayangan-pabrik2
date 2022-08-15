import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useMutation } from "@apollo/client";
import {
  DELETE_VMWARE_INSTANCE,
  UPDATE_VMWARE_STATUS,
  UPDATE_VMWARE_STATUS_2,
} from "@utils/gql/instance/constant";
import DeleteInstanceVM from "@components/molecules/DeleteInstanceVM";
import { makeStyles } from "@mui/styles";
import ConsoleVM from "./ConsoleVM";
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

export default function ActionVMWare({ data, refetch }) {
  const [actButton, setActButton] = React.useState(data?.state);
  const [isLoadingOn, setIsLoadingOn] = useState(false);
  const [isLoadingOff, setIsLoadingOff] = useState(false);
  const [isLoadingReboot, setIsLoadingReboot] = useState(false);
  const [deleteInstance, setDeleteInstance] = useState(false);
  const [cacheUrl, setCacheUrl] = useState("");

  const [deleteVMWareInstance, { loading }] = useMutation(
    DELETE_VMWARE_INSTANCE
  );

  const handleChange = (e) => {
    setActButton(e.target.value);
    if (e.target.value === "poweredOn") {
      handlePowerOn();
    } else if (e.target.value === "poweredOff") {
      handlePowerOff();
    } else if (e.target.value === "Reboot") {
      handleReboot();
    } else if (e.target.value === "Delete") {
      setDeleteInstance(true);
      setActButton(data.state);
    } else if (e.target.value === "Console") {
      handleConsole();
      setActButton("poweredOn");
    }
  };

  const token = window.localStorage.getItem("factory-token");

  const handleConsole = () => {
    axios
      .get(
        `https://dev-khayanganjxhpv.microgen.id/function/vmware-eu-ticketbyvm?query=${data?.name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const console = response.data.Data;
        setCacheUrl(`https://${console.host}`);
        window.open(
          `/view/index.html?host=${console.host}&port=${console.port}&ticket=${console.ticket}`
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [updatePowerStatus, { loadingStatus }] = useMutation(
    UPDATE_VMWARE_STATUS_2
  );

  const handlePowerOn = async () => {
    setIsLoadingOn(true);
    try {
      const response = await axios.post(
        "https://stg-khayanganjxhpv.microgen.id/function/vmware-poweron",
        {
          name_vm: data?.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        setIsLoadingOn(false);
        updatePowerStatus({
          variables: {
            id: data.id,
            input: {
              state: "poweredOn",
            },
          },
        });
        refetch();
      }
      // setTimeout(() => {
      //   setIsLoadingOn(false);
      //   updatePowerStatus({
      //     variables: {
      //       id: data.id,
      //       input: {
      //         state: "poweredOn",
      //       },
      //     },
      //   });
      //   refetch();
      // }, 1000 * 40);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePowerOff = async () => {
    setIsLoadingOff(true);
    try {
      const response = await axios.post(
        "https://stg-khayanganjxhpv.microgen.id/function/vmware-poweroff",
        {
          name_vm: data?.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        setIsLoadingOff(false);
        updatePowerStatus({
          variables: {
            id: data.id,
            input: {
              state: "poweredOff",
            },
          },
        });
        refetch();
      }
      // setTimeout(() => {
      //   setIsLoadingOff(false);
      //   updatePowerStatus({
      //     variables: {
      //       id: data.id,
      //       input: {
      //         state: "poweredOff",
      //       },
      //     },
      //   });
      //   refetch();
      // }, 1000 * 5);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReboot = async () => {
    setIsLoadingReboot(true);
    try {
      const response = await axios.post(
        "https://stg-khayanganjxhpv.microgen.id/function/vmware-reboot",
        {
          name_vm: data?.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      if (response.status == 200) {
        setIsLoadingReboot(false);
        setActButton("poweredOn");
        refetch();
      }
      // setTimeout(() => {
      //   setIsLoadingReboot(false);
      //   setActButton("poweredOn");
      // }, 1000 * 40);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      deleteVMWareInstance({
        variables: {
          id: data.id,
        },
      });
      await axios.post(
        "https://stg-khayanganjxhpv.microgen.id/function/vmware-deletevm",
        {
          name_vm: data?.name,
        }
      );
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const classes = useStyles();

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size="small">
        {actButton === "poweredOff" ? (
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
            <MenuItem value="poweredOff" disabled>
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
            <MenuItem value="poweredOn">
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
            <MenuItem value="poweredOn" disabled>
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
            <MenuItem value="poweredOff">
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
            <MenuItem value="Reboot">
              {isLoadingReboot ? (
                <div style={{ display: "flex" }}>
                  <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  <p style={{ marginLeft: "0.5rem", color: "white" }}>
                    Rebooting
                  </p>
                </div>
              ) : (
                "Reboot"
              )}
            </MenuItem>
            <MenuItem value="Delete">Delete</MenuItem>
            <MenuItem value="Console">Console</MenuItem>
          </Select>
        )}
      </FormControl>
      {deleteInstance ? (
        <DeleteInstanceVM
          close={() => {
            setDeleteInstance(false);
          }}
          handleDelete={handleDelete}
        />
      ) : null}
    </Box>
  );
}
