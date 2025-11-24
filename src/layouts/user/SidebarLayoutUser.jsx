import React from "react";
import SidebarComponent from "../../components/user/SidebarComponent/SidebarComponent";
import BottomNavbarComponent from "../../components/user/BottomNavbarComponent/BottomNavbarComponent";
import SidebarGroupComponent from "../../components/user/SidebarGroupComponent/SidebarGroupComponent";
import { useLocation } from "react-router-dom";
import SidebarAccountComponent from "../../components/user/SidebarAccountComponent/SidebarAccountComponent";

const SidebarLayoutUser = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarComponent />

      {(location.pathname === "/accounts/edit" ||
        location.pathname === "/accounts/tags_and_mentions" ||
        location.pathname === "/accounts/activities" ||
        location.pathname === "/accounts/security" ||
        location.pathname === "/accounts/blocked_accounts" ||
        location.pathname === "/accounts/delete_account") && (
        <SidebarAccountComponent />
      )}

      <main className="flex-1 overflow-y-auto">{children}</main>

      {(location.pathname === "/groups/feed" ||
        location.pathname === "/groups/discover" ||
        location.pathname === "/groups/join") && <SidebarGroupComponent />}

      <BottomNavbarComponent />
    </div>
  );
};

export default SidebarLayoutUser;
