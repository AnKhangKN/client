import React, { useState } from "react";
import { HiBars3, HiBars3BottomLeft } from "react-icons/hi2";
import { useLocation } from "react-router-dom";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import { PiBellSimpleRingingLight, PiMoonLight } from "react-icons/pi";

const HeaderComponent = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSubModal, setSubModal] = useState(false);
  const location = useLocation();

  const listLocation = [
    { label: location.pathname === "/admin" && "Tổng quan" },
    { label: location.pathname === "/admin/groups" && "Quản lý nhóm" },
    { label: location.pathname === "/admin/department" && "Quản lý đoàn khoa" },
    { label: location.pathname === "/admin/message" && "Quản lý tin nhắn" },
  ];

  const handleClick = () => {
    setIsOpen(!isOpen);
    toggleSidebar();
  };

  const handleOpenSubModal = () => {
    setSubModal((prev) => !prev);
  };

  return (
    <div className="flex-shrink-0 py-4 bg-white shadow">
      <div className="flex justify-between items-center px-4">
        {/* Left: Toggle + Page Title */}
        <div className="flex items-center">
          <div
            className="text-2xl cursor-pointer me-4 p-2 rounded-full hover:bg-gray-200 transition-all duration-300 ease-in-out active:scale-90"
            onClick={handleClick}
          >
            {isOpen ? <HiBars3 /> : <HiBars3BottomLeft />}
          </div>
          {listLocation.map(
            (item, index) =>
              item.label && (
                <div
                  key={index}
                  className="text-lg transition-opacity duration-300"
                >
                  {item.label}
                </div>
              )
          )}
        </div>

        {/* Right: Icons + Avatar */}
        <div className="flex items-center gap-6 relative">
          <div className="text-2xl cursor-pointer hover:bg-gray-200 p-2 rounded-full transition-all duration-300 active:scale-90">
            <PiMoonLight />
          </div>

          <div className="text-2xl cursor-pointer hover:bg-gray-200 p-2 rounded-full transition-all duration-300 active:scale-90">
            <PiBellSimpleRingingLight />
          </div>

          <div className="relative">
            <img
              src={LogoCTUT}
              onClick={handleOpenSubModal}
              className="w-8 h-8 cursor-pointer rounded-full hover:ring-2 hover:ring-gray-300 transition-all duration-300"
              alt="Logo_info"
            />

            {/* Sub Modal */}
            <div
              className={`absolute flex flex-col w-52 end-0 top-13 bg-gray-100 rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 ease-in-out p-2
              ${
                isSubModal
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-2 invisible"
              }`}
            >
              <div className="p-2 hover:bg-gray-200 rounded-sm cursor-pointer transition-all">
                Trang cá nhân
              </div>
              <div className="p-2 hover:bg-gray-200 rounded-sm cursor-pointer transition-all">
                Đăng xuất
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
