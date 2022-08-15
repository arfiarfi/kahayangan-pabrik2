import * as React from "react";
import { Backdrop, Box, Modal, Fade, Typography, Chip } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { IoNotificationsOutline } from "react-icons/io5";

const style = {
  position: "absolute",
  top: 52.5,
  right: 0,
  width: 360,
  bgcolor: "#fff",
  border: "1px solid gray",
  boxShadow: 24,
  boxSizing: "border-box",
  p: "1rem 0 0",
  outline: "none",
};

export default function PopUpNotif() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div style={{ cursor: "pointer" }}>
      <IoNotificationsOutline fontSize={28} onClick={handleOpen} />

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                boxSizing: "border-box",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                id="transition-modal-title"
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                Notifications
              </Typography>
              <MoreHorizIcon
                sx={{
                  cursor: "pointer",
                  fontSize: "x-large",
                }}
              />
            </Box>

            <Box
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.25rem 1rem",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                gap: 25,
              }}
            >
              <Chip
                label="Semua"
                component="a"
                href="#basic-chip"
                size="small"
                clickable
                sx={{
                  bgcolor: "#EEB628",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                Belum dibaca
              </Typography>
            </Box>

            <Box
              style={{
                width: "100%",
                padding: "1rem 1rem 0.5rem 1rem",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "solid 1px #00000020",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                Baru
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                Lihat Semua
              </Typography>
            </Box>

            {/* unread notif card */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#E0E0E0",
                boxSizing: "border-box",
                p: "0.5rem 0.8rem",
                gap: 2,
                cursor: "pointer",
                borderBottom: "1px solid #cccccc",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "flex-start",
                }}
              >
                <FiberManualRecordIcon
                  fontSize="1"
                  sx={{
                    fontWeight: 100,
                    color: "#7C7C7C",
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#7C7C7C",
                    }}
                  >
                    <b>Market Overview query</b> was cloned by Clarissa90r 5
                    minutes ago. Please go to Query Details to see the further
                    information.
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#7C7C7C",
                    }}
                  >
                    2020-05-19 11:20
                  </Typography>
                </Box>
              </Box>
              <ArrowForwardIosSharpIcon
                fontSize="2"
                sx={{
                  color: "#7C7C7C",
                }}
              />
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#E0E0E0",
                boxSizing: "border-box",
                p: "0.5rem 0.8rem",
                gap: 2,
                cursor: "pointer",
                borderBottom: "1px solid #cccccc",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "flex-start",
                }}
              >
                <FiberManualRecordIcon
                  fontSize="1"
                  sx={{
                    fontWeight: 100,
                    color: "#7C7C7C",
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#7C7C7C",
                    }}
                  >
                    <b>Market Overview query</b> was cloned by Clarissa90r 5
                    minutes ago. Please go to Query Details to see the further
                    information.
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#7C7C7C",
                    }}
                  >
                    2020-05-19 11:20
                  </Typography>
                </Box>
              </Box>
              <ArrowForwardIosSharpIcon
                fontSize="2"
                sx={{
                  color: "#7C7C7C",
                }}
              />
            </Box>

            {/* opened notif card */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                boxSizing: "border-box",
                p: "0.5rem 1.5rem",
                gap: 2,
                cursor: "pointer",
                borderBottom: "1px solid #cccccc",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#7C7C7C",
                  }}
                >
                  <b>Market Overview query</b> was cloned by Clarissa90r 5
                  minutes ago. Please go to Query Details to see the further
                  information.
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#7C7C7C",
                  }}
                >
                  2020-05-19 11:20
                </Typography>
              </Box>
              <ArrowForwardIosSharpIcon
                fontSize="2"
                sx={{
                  color: "#7C7C7C",
                }}
              />
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                boxSizing: "border-box",
                p: "0.5rem 1.5rem",
                gap: 2,
                cursor: "pointer",
                borderBottom: "1px solid #cccccc",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#7C7C7C",
                  }}
                >
                  <b>Market Overview query</b> was cloned by Clarissa90r 5
                  minutes ago. Please go to Query Details to see the further
                  information.
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#7C7C7C",
                  }}
                >
                  2020-05-19 11:20
                </Typography>
              </Box>
              <ArrowForwardIosSharpIcon
                fontSize="2"
                sx={{
                  color: "#7C7C7C",
                }}
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
