import React from "react";
import { useLocation } from "react-router-dom";

import SidebarComponent from "../../components/user/SidebarComponent/SidebarComponent";
import BottomNavbarComponent from "../../components/user/BottomNavbarComponent/BottomNavbarComponent";
import SidebarGroupComponent from "../../components/user/SidebarGroupComponent/SidebarGroupComponent";
import SidebarAccountComponent from "../../components/user/SidebarAccountComponent/SidebarAccountComponent";
import SidebarDepartmentComponent from "../../components/user/SidebarDepartmentComponent/SidebarDepartmentComponent";

const SidebarLayoutUser = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  // Các route cho từng sidebar
  const accountRoutes = [
    "/accounts/edit",
    "/accounts/tags_and_mentions",
    "/accounts/activities",
    "/accounts/security",
    "/accounts/blocked_accounts",
    "/accounts/delete_account",
  ];

  const departmentRoutes = ["/department/feed", "/department/discover"];

  const groupRoutes = ["/groups/feed", "/groups/discover", "/groups/join"];

  // Kiểm tra route dynamic
  const isDepartmentFeedDynamic = path.startsWith("/department/feed/");

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarComponent />

      {accountRoutes.includes(path) && <SidebarAccountComponent />}

      <main className="flex-1 overflow-y-auto">{children}</main>

      {groupRoutes.includes(path) && <SidebarGroupComponent />}

      {(departmentRoutes.includes(path) || isDepartmentFeedDynamic) && (
        <SidebarDepartmentComponent />
      )}

      <BottomNavbarComponent />
    </div>
  );
};

export default SidebarLayoutUser;
