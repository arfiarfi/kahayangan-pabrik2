import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { Typography, Divider, Box } from "@mui/material";
import { FaCaretDown, FaDatabase } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";

import logo from "../assets/logo.svg";
import sync from "../assets/Sync.svg";
import { removeUser } from "@redux/features/auth/authSlice";

import { SidebarData } from "@components/atoms/sidebar/dataSidebar";
import SubMenu from "@components/atoms/sidebar/subMenu";
import SidebarItem from "@components/atoms/sidebar/subMenu";
import "@components/atoms/sidebar/sidebar.css";
import PopUpNotif from "@components/molecules/PopUpNotif";
import { Sidebar } from "@components/organism/Sidebar";

const DashboardLayout = () => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();

  const AuthStore = useSelector((state) => state.auth);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(removeUser());
  };

  return AuthStore.user && AuthStore.user.role === "ADMINFACTORY" ? (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
        }}
      >
        {/* Sidebar Start */}
        <div style={{ height: "100%" }}>
          <Sidebar />
        </div>
        {/* Sidebar End */}

        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
          {/* Navbar Start */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              boxShadow: "0px 0px 5px 0px gray",
              justifyContent: "flex-end",
              height: "3.75rem",
              width: "100%",
            }}
          >
            {/* User Start */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div>
                <img
                  src="https://png.pngtree.com/png-vector/20200614/ourlarge/pngtree-businessman-user-avatar-character-vector-illustration-png-image_2242909.jpg"
                  alt=""
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    objectFit: "cover",
                    objectPosition: "middle",
                    borderRadius: "2rem",
                  }}
                />
              </div>
              <div
                style={{
                  marginLeft: 10,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: "Bold",
                  }}
                >
                  {AuthStore.user.lastName
                    ? `${AuthStore.user.firstName} ${AuthStore.user.lastName}`
                    : AuthStore.user.firstName}
                </p>
                <p style={{ marginTop: 1, fontSize: 10 }}>Super Admin</p>
              </div>
            </div>
            {/* User End */}

            <Divider
              orientation="vertical"
              flexItem
              sx={{ marginLeft: 5, marginRight: 3 }}
            />

            {/* Notification Start */}
            <div>
              <PopUpNotif />
            </div>
            {/* Notification End */}

            <Divider orientation="vertical" flexItem sx={{ marginX: 3 }} />

            {/* Setting Start */}
            <div>
              <FiSettings style={{ fontSize: 28, paddingRight: 20 }} />
            </div>
            {/* Setting End */}
          </div>
          {/* Navbar End */}

          {/* container for content */}
          <div
            style={{
              width: "auto",
              height: "93%",
              overflow: "auto",
              boxSizing: "border-box",
            }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  ) : (
    <Outlet />
  );
};

export default DashboardLayout;
