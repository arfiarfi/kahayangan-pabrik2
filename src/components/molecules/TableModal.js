import React, { useState, useEffect } from "react";
import { PageTitle } from "@components/atoms/pageTitle";
import { GET_USERS } from "@utils/gql/instance/constant";
import { useLazyQuery } from "@apollo/client";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Button } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Pagination, Stack, Skeleton, Typography } from "@mui/material";
import CollapsibleTable from "./ExpandTable";
import Datatable from "./table";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  width: "62rem",
  boxShadow: "1.25rem",
  p: 4,
};

export default function TableModal({
  open,
  close,
  baremetals,
  clientName,
  loading,
  columns,
  expand,
  rowData,
}) {
  const title = `List Baremetals from Zone ${rowData?.zone?.name} Hypervisor ${rowData?.name}`;

  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState({
    total: baremetals.length,
    current: 0,
    pageSize: 10,
  });

  const handleChangePagination = (pageNumber) => {
    setPage(pageNumber - 1);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={close}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                sx={{
                  ":hover": {
                    bgcolor: "white",
                  },
                }}
                onClick={close}
              >
                <AiOutlineClose style={{ fontSize: "1.5rem" }} color="black" />
              </Button>
            </div>
            <PageTitle title={title} marginTop="1rem" fontWeight={600} />

            <div style={{ maxHeight: "50vh", overflowY: "hidden" }}>
              <CollapsibleTable baremetals={baremetals} />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "1.25rem",
                paddingBottom: "1.25rem",
              }}
            >
              <div>
                <Typography sx={{ color: "black" }}>{`${
                  page * pagination.pageSize + 1
                }-${page * pagination.pageSize + baremetals.length} of ${
                  baremetals.length
                }`}</Typography>
              </div>
              <div>
                <Stack spacing={2}>
                  <Pagination
                    count={Math.ceil(baremetals.length / pagination.pageSize)}
                    shape="rounded"
                    onChange={(event, pageNumber) =>
                      handleChangePagination(pageNumber)
                    }
                    page={page + 1}
                  />
                </Stack>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

const TableLoading = ({ columns, dataSource }) => (
  <TableBody>
    {[...new Array(dataSource.length)].map((row, index) => {
      return (
        <StyledTableRow key={index}>
          {[...new Array(columns?.length ?? 5)].map((item, i) => (
            <StyledTableCell
              key={i}
              align="center"
              style={{
                fontWeight: "bold",
                px: "1rem",
                py: "1rem",
              }}
            >
              <Skeleton width="100%" />
            </StyledTableCell>
          ))}
        </StyledTableRow>
      );
    })}
  </TableBody>
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
