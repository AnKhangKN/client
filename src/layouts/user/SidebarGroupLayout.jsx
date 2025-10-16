import React from "react";
import SidebarComponent from "../../components/user/SidebarComponent/SidebarComponent";
import SidebarGroupComponent from "../../components/user/SidebarGroupComponent/SidebarGroupComponent";
import BottomNavbarComponent from "../../components/user/BottomNavbarComponent/BottomNavbarComponent";

const SidebarGroupLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarComponent />

      <main className="flex-1 overflow-y-auto scrollbar-hide bg-[#f2f4f7]">
        {children}
      </main>

      <SidebarGroupComponent />

      <BottomNavbarComponent />
    </div>
  );
};

export default SidebarGroupLayout;
