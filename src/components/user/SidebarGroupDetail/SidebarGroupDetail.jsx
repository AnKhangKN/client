import React from "react";
import { useNavigate } from "react-router-dom";
import logoCTUT from "@/assets/logo/logo-ctut.png";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  HiUserGroup,
  HiCog6Tooth,
  HiUsers,
  HiBookmark,
  HiArrowLeftOnRectangle,
} from "react-icons/hi2";

const SidebarGroupDetail = ({ groupPrivacy }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <HiUserGroup />, label: "Cộng đồng" },
    ...(groupPrivacy === "approve"
      ? [{ icon: <HiBookmark />, label: "Yêu cầu tham gia" }]
      : []),
    { icon: <HiUsers />, label: "Thành viên" },
    { icon: <HiCog6Tooth />, label: "Cài đặt nhóm" },
  ];

  const dangerItem = {
    icon: <HiArrowLeftOnRectangle />,
    label: "Rời nhóm",
    danger: true,
  };

  return (
    <div className="h-screen bg-gray-100 p-3">
      <div className="bg-white h-full rounded-xl shadow-md flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center space-x-3 p-4 border-b sticky top-0 bg-white z-10">
          <button
            onClick={() => navigate("/groups/feed")}
            className="p-1 hover:bg-gray-200 rounded-full transition"
          >
            <IoIosArrowRoundBack size={28} />
          </button>

          <img className="w-10 h-10 rounded-full" src={logoCTUT} alt="Logo" />

          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">Nhóm CTUT</span>
            <span className="text-sm text-gray-500">Cộng đồng học tập</span>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* Các mục thường */}
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          {/* Danger item */}
          <div className="pt-3">
            <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 transition">
              <span className="text-xl">{dangerItem.icon}</span>
              <span className="font-medium">{dangerItem.label}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarGroupDetail;
