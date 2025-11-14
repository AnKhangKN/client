import React from "react";
import SidebarComponent from "../../components/user/SidebarComponent/SidebarComponent";
import BottomNavbarComponent from "../../components/user/BottomNavbarComponent/BottomNavbarComponent";
import SidebarGroupComponent from "../../components/user/SidebarGroupComponent/SidebarGroupComponent";
import { useLocation } from "react-router-dom";

const SidebarLayoutUser = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarComponent />

      <main className="flex-1 overflow-y-auto">{children}</main>

      {location.pathname === "/groups/feed" ||
      location.pathname === "/groups/discover" ||
      location.pathname === "/groups/join" ? (
        <SidebarGroupComponent />
      ) : null}

      <BottomNavbarComponent />
    </div>
  );
};

export default SidebarLayoutUser;
