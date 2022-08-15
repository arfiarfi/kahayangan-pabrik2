import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import oval from "@assets/ovals.svg";

function createData(
  hostname,
  ramTotal,
  vcpusTotal,
  storageType,
  localStorageTotal
) {
  return {
    hostname,
    ramTotal,
    vcpusTotal,
    storageType,
    localStorageTotal,
  };
}

function Row(props) {
  const { row, index, rowDatas, totalMemory, totalCPU, totalStorage } = props;
  const [open, setOpen] = React.useState(false);

  const simplify = (value) => {
    if (value <= 1000) {
      return `${value} GB`;
    } else {
      return `${(value / 1000).toFixed(2)} TB`;
    }
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
        }}
      >
        <TableCell
          sx={{
            fontWeight: "bold",
            boxSizing: "border-box",
          }}
        >
          {/* <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton> */}
          {index + 1}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            fontWeight: "bold",
          }}
        >
          {row.hostname.slice(0, 8)}
        </TableCell>
        <TableCell
          align="left"
          sx={{
            fontWeight: "bold",
          }}
        >
          {simplify(totalMemory[index])}
        </TableCell>
        <TableCell
          align="left"
          sx={{
            fontWeight: "bold",
          }}
        >
          {`${totalCPU[index]} Core`}
        </TableCell>
        <TableCell
          align="left"
          sx={{
            fontWeight: "bold",
          }}
        >
          {row.storageType}
        </TableCell>
        <TableCell
          align="left"
          sx={{
            fontWeight: "bold",
          }}
        >
          {simplify(totalStorage[index])}
        </TableCell>
      </TableRow>
      {/* <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }} align="left">
                      Name
                    </TableCell>
                    <TableCell align="left" style={{ fontWeight: "bold" }}>
                      Memory
                    </TableCell>
                    <TableCell align="left" style={{ fontWeight: "bold" }}>
                      CPU
                    </TableCell>
                    <TableCell align="left" style={{ fontWeight: "bold" }}>
                      Storage Type
                    </TableCell>
                    <TableCell align="left" style={{ fontWeight: "bold" }}>
                      Storage
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowDatas[index].map((expand, i) => (
                    <TableRow
                      key={i}
                      style={
                        i % 2 === 0
                          ? { backgroundColor: "#F2F2F2" }
                          : { backgroundColor: "white" }
                      }
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ fontWeight: "bold" }}
                      >
                        {expand.hostname}
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        {simplify(expand.ramTotal)}
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        {`${expand.vcpusTotal} Core`}
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        {expand.storageType}
                      </TableCell>
                      <TableCell align="left" style={{ fontWeight: "bold" }}>
                        {simplify(expand.localStorageTotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow> */}
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    hostname: PropTypes.string.isRequired,
    ramTotal: PropTypes.number.isRequired,
    vcpusTotal: PropTypes.number.isRequired,
    storageType: PropTypes.string,
    localStorageTotal: PropTypes.number.isRequired,
  }).isRequired,
};

export default function CollapsibleTable({ baremetals }) {
  const [rows, setRows] = React.useState([]);
  const [totalMemory, setTotalMemory] = React.useState([]);
  const [totalCPU, setTotalCPU] = React.useState([]);
  const [totalStorage, setTotalStorage] = React.useState([]);
  React.useEffect(() => {
    setRows([]);
    setTotalMemory([]);
    setTotalCPU([]);
    setTotalStorage([]);
    baremetals.map((baremetal) => {
      console.log(baremetal);
      const sum = function (items, prop) {
        return items.reduce(function (a, b) {
          return a + b[prop];
        }, 0);
      };

      let _totalMemory = sum(baremetal, "ramTotal");
      setTotalMemory((old) => [...old, _totalMemory]);

      let _totalCPU = sum(baremetal, "vcpusTotal");
      setTotalCPU((old) => [...old, _totalCPU]);

      let _totalStorage = sum(baremetal, "localStorageTotal");
      setTotalStorage((old) => [...old, _totalStorage]);

      return setRows((old) => [
        ...old,
        createData(
          baremetal[0].hostname,
          baremetal[0].ramTotal,
          baremetal[0].vcpusTotal,
          baremetal[0].storageType,
          baremetal[0].localStorageTotal
        ),
      ]);
    });
  }, []);

  return (
    <TableContainer
      component={Paper}
      style={{
        background: "#FDF7E9",
        borderRadius: 8,
        backgroundImage: `url(${oval})`,
        backgroundPosition: "150px 100%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100rem",
      }}
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>No</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell align="left" style={{ fontWeight: "bold" }}>
              Memory
            </TableCell>
            <TableCell align="left" style={{ fontWeight: "bold" }}>
              CPU
            </TableCell>
            <TableCell align="left" style={{ fontWeight: "bold" }}>
              Storage Type
            </TableCell>
            <TableCell align="left" style={{ fontWeight: "bold" }}>
              Storage
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <Row
              key={i}
              row={row}
              index={i}
              rowDatas={baremetals}
              totalMemory={totalMemory}
              totalCPU={totalCPU}
              totalStorage={totalStorage}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
