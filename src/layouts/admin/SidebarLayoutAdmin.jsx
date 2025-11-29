import React, { useState } from "react";
import SidebarComponent from "../../components/admin/SidebarComponent/SidebarComponent";
import HeaderComponent from "../../components/admin/HeaderComponent/HeaderComponent";
import SidebarPostComponent from "@/components/admin/SidebarPostComponent/SidebarPostComponent";
import { useLocation } from "react-router-dom";

const SidebarLayoutAdmin = ({ children }) => {
  const [isShowSidebar, setIsShowSidebar] = useState(true);
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarComponent isShowSidebar={isShowSidebar} />

      <div className="flex flex-col w-full">
        <HeaderComponent
          toggleSidebar={() => setIsShowSidebar((prev) => !prev)}
        />

        <div className="flex">
          {(path === "/admin/posts" ||
            path === "/admin/posts/users" ||
            path === "/admin/posts/groups" ||
            path === "/admin/posts/departments") && <SidebarPostComponent />}

          <div className="overflow-y-auto bg-white p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayoutAdmin;
