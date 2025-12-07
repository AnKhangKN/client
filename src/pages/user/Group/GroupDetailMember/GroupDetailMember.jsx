import SidebarGroupDetail from "@/components/user/SidebarGroupDetail/SidebarGroupDetail";
import React from "react";

const GroupDetailMember = () => {
  return (
    <div className="flex">
      {/* LEFT SIDEBAR */}
      <SidebarGroupDetail />

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-neutral-100 p-4 overflow-hidden h-screen"></div>
    </div>
  );
};

export default GroupDetailMember;
