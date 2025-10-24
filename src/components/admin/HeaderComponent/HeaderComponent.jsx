import React, { useState } from "react";
import { HiBars3, HiBars3BottomLeft } from "react-icons/hi2";
import { useLocation } from "react-router-dom";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import { PiBellSimpleRingingLight, PiMoonLight } from "react-icons/pi";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const HeaderComponent = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSubModal, setSubModal] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const location = useLocation();

  const listLocation = [
    { label: location.pathname === "/admin" && "Tổng quan" },
    { label: location.pathname === "/admin/user" && "Quản lý người dùng" },
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

  const handleOpenModalLogout = () => {
    setModalLogout(true);
  };

  const handleCloseModalLogout = () => {
    setModalLogout(false);
  };

  return (
    <div className="flex-shrink-0 py-4 border-b border-gray-400 bg-white shadow">
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
        <div className="flex items-center gap-4 relative">
          <div className="text-2xl cursor-pointer hover:bg-gray-200 p-2 rounded-full transition-all duration-300 active:scale-90">
            <PiMoonLight />
          </div>

          <div className="relative">
            <div className="text-2xl cursor-pointer hover:bg-gray-200 p-2 rounded-full transition-all duration-300 active:scale-90">
              <PiBellSimpleRingingLight />
            </div>

            <div className="absolute top-0 right-0 bg-blue-600 rounded-full w-5 h-5 flex justify-center items-center">
              <span className="text-[10px] text-white">1</span>
              {/* 
              <span className="text-[10px] text-white">99</span>
              <span className="text-[8px] text-white">+</span>
               */}
            </div>

            <div className="absolute top-10 w-[360px] flex flex-col gap-4 rounded-sm border right-0 bg-white shadow-lg p-4">
              <div className="flex justify-between items-center">
                <div>Thông báo cho bạn.</div>
                <div>
                  <HiOutlineDotsHorizontal className="cursor-pointer" />
                </div>
              </div>

              <div>
                <div>Thông báo 1</div>
                <div>Thông báo 2</div>
                <div>Thông báo 3</div>
                <div></div>
              </div>
            </div>
          </div>

          <div className="relative ms-8">
            <img
              src={LogoCTUT}
              onClick={handleOpenSubModal}
              className="w-8 h-8 cursor-pointer rounded-full hover:ring-2 hover:ring-gray-300 transition-all duration-300"
              alt="Logo_info"
            />

            {/* Sub Modal */}
            <div
              className={`absolute flex flex-col w-52 end-0 top-10 bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 ease-in-out p-2
              ${
                isSubModal
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-2 invisible"
              }`}
            >
              <div className="p-2 hover:bg-gray-200 rounded-sm cursor-pointer transition-all">
                Trang cá nhân
              </div>
              <div
                onClick={handleOpenModalLogout}
                className="p-2 hover:bg-gray-200 rounded-sm cursor-pointer transition-all"
              >
                Đăng xuất
              </div>
            </div>

            {/* Modal confirm logout */}
            {modalLogout && (
              <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/50">
                <div className="bg-white flex flex-col p-6 gap-6  rounded-lg">
                  <div className="text-xl">
                    Bạn có chắc chắn muốn đăng xuất?
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <ButtonComponent
                      text="Hủy"
                      bgColor="bg-white"
                      onClick={handleCloseModalLogout}
                      textColor="text-black"
                      hoverColor="hover:bg-gray-100"
                    />
                    <ButtonComponent text="Đăng xuất" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
