import React from "react";
import SidebarComponent from "../../components/user/SidebarComponent/SidebarComponent";
import BottomNavbarComponent from "../../components/user/BottomNavbarComponent/BottomNavbarComponent";

const SidebarLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarComponent />

      <main className="flex-1 overflow-y-auto bg-[#f2f4f7]">{children}</main>

      <BottomNavbarComponent />
    </div>
  );
};

export default SidebarLayout;
