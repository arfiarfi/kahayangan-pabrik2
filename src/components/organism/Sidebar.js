import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUser } from "@redux/features/auth/authSlice";

import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { FiMap, FiLogOut } from "react-icons/fi";
import { BiBuilding, BiGitPullRequest } from "react-icons/bi";
import { BsHddRack } from "react-icons/bs";
import { TbHierarchy2, TbUsers } from "react-icons/tb";
import logo from "@assets/logo.svg";
import "react-pro-sidebar/dist/css/styles.css";

export const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(removeUser());
  };
  return (
    <ProSidebar>
      {/* Header Start */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "1.25rem",
          boxSizing: "border-box",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
        <Typography
          onClick={() => navigate("/")}
          sx={{
            color: "white",
            fontWeight: "bold",
            marginLeft: 1,
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          Khayangan
        </Typography>
      </div>
      {/* Header End */}

      <SidebarContent>
        <Menu>
          <MenuItem icon={<FiMap />}>
            Location
            <Link to={"/"} />
          </MenuItem>
          {/* <MenuItem icon={<BiBuilding />}>
          Zone
          <Link to={"/zone"} />
        </MenuItem> */}
          <MenuItem icon={<BsHddRack />}>
            List Hypervisor
            <Link to={"/hypervisor"} />
          </MenuItem>
          <SubMenu title="Manage Hypervisor" icon={<TbHierarchy2 />}>
            <SubMenu title="OpenStack">
              <MenuItem>
                Hypervisor
                <Link to="/hypervisor/openstack/list" />
              </MenuItem>
              <MenuItem>
                Project
                <Link to="/hypervisor/openstack/project" />
              </MenuItem>
              <MenuItem>
                Instance
                <Link to="/hypervisor/openstack/instance" />
              </MenuItem>
              <MenuItem>
                Volume
                <Link to="/hypervisor/openstack/volume" />
              </MenuItem>
            </SubMenu>
            <SubMenu title="VMWare">
              <MenuItem>
                Hypervisor
                <Link to="/hypervisor/wmWare/list" />
              </MenuItem>
              <MenuItem>
                Project
                <Link to="/hypervisor/vmware/project" />
              </MenuItem>
              <MenuItem>
                Instance
                <Link to="/hypervisor/vmware/instance" />
              </MenuItem>
              <MenuItem>
                Volume
                <Link to="/hypervisor/vmware/volume" />
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu title="Request" icon={<BiGitPullRequest />}>
            <MenuItem>
              Hypervisor
              <Link to={"/request/newReq"} />
            </MenuItem>
            {/* <SubMenu title="OpenStack">
              <MenuItem>
                Request
                <Link to={"/request/openstack/list"} />
              </MenuItem>
              <MenuItem>
                Project
                <Link to="/request/openstack/project" />
              </MenuItem>
            </SubMenu>
            <SubMenu title="VMWare">
              <MenuItem>Request</MenuItem>
              <MenuItem>Project</MenuItem>
            </SubMenu> */}
          </SubMenu>
          <MenuItem icon={<TbUsers />}>
            Client
            <Link to={"/client"} />
          </MenuItem>
        </Menu>
      </SidebarContent>

      <SidebarFooter>
        <Menu>
          <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </SidebarFooter>
    </ProSidebar>
  );
};
