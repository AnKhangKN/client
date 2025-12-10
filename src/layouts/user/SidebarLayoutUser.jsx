import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as DepartmentServices from "@/services/admin/DepartmentServices";
import * as ValidateToken from "@/utils/token.utils";
import SidebarComponent from "../../components/user/SidebarComponent/SidebarComponent";
import BottomNavbarComponent from "../../components/user/BottomNavbarComponent/BottomNavbarComponent";
import SidebarGroupComponent from "../../components/user/SidebarGroupComponent/SidebarGroupComponent";
import SidebarAccountComponent from "../../components/user/SidebarAccountComponent/SidebarAccountComponent";
import SidebarDepartmentComponent from "../../components/user/SidebarDepartmentComponent/SidebarDepartmentComponent";

const SidebarLayoutUser = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const [departments, setDepartments] = useState([]);

  // Các route cho từng sidebar
  const accountRoutes = [
    "/accounts/edit",
    "/accounts/social",
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

  useEffect(() => {
    const departmentPath = path.startsWith("/department");
    if (!departmentPath) return;

    const fetchDepartments = async () => {
      try {
        const accessToken = await ValidateToken.getValidAccessToken();
        const departments = await DepartmentServices.getDepartments(
          accessToken
        );
        setDepartments(departments.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDepartments();
  }, [path]);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarComponent />

      {accountRoutes.includes(path) && <SidebarAccountComponent />}

      <main className="flex-1 overflow-y-auto scrollbar-hide">{children}</main>

      {groupRoutes.includes(path) && <SidebarGroupComponent />}

      {(departmentRoutes.includes(path) || isDepartmentFeedDynamic) && (
        <SidebarDepartmentComponent departments={departments} />
      )}

      <BottomNavbarComponent />
    </div>
  );
};

export default SidebarLayoutUser;
