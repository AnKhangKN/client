import React, { useState } from "react";
import SidebarComponent from "../../components/admin/SidebarComponent/SidebarComponent";
import HeaderComponent from "../../components/admin/HeaderComponent/HeaderComponent";

const SidebarLayoutAdmin = ({ children }) => {
  const [isShowSidebar, setIsShowSidebar] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarComponent isShowSidebar={isShowSidebar} />

      <div className="flex flex-col w-full">
        <HeaderComponent
          toggleSidebar={() => setIsShowSidebar((prev) => !prev)}
        />

        <div className="overflow-y-auto bg-[#f1f5f9] p-4">{children}</div>
      </div>
    </div>
  );
};

export default SidebarLayoutAdmin;
