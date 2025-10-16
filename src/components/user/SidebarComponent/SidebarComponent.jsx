import React, { useState, useRef, useEffect } from "react";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import {
  HiOutlineBars3,
  HiMiniUserGroup,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { GoHome, GoHomeFill } from "react-icons/go";
import {
  PiBellSimpleRinging,
  PiBellSimpleRingingFill,
  PiChatTeardropDots,
  PiChatTeardropDotsFill,
} from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import { MdOutlineClose } from "react-icons/md";
import "./style.css";

const SidebarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchContainer, setSearchContainer] = useState(false);
  const searchRef = useRef(null);

  // 👉 Mở / Đóng modal tìm kiếm
  const handleOpenSearchContainer = () => setSearchContainer(true);
  const handleCloseSearchContainer = () => setSearchContainer(false);

  // 👉 Click ngoài modal => tự động đóng
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchContainer(false);
      }
    };

    if (searchContainer) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainer]);

  const listNavigate = [
    {
      icon: location.pathname === "/" ? <GoHomeFill /> : <GoHome />,
      nav: "/",
      label: "Trang chủ",
    },
    {
      icon: <RiSearchLine />,
      label: "Tìm kiếm",
      onClick: handleOpenSearchContainer,
    },
    {
      icon: ["/groups/feed", "/groups/discover", "/groups/join"].includes(
        location.pathname
      ) ? (
        <HiMiniUserGroup />
      ) : (
        <HiOutlineUserGroup />
      ),
      nav: "/groups/feed",
      label: "Nhóm",
    },
    {
      icon:
        location.pathname === "/department" ? (
          <img
            className="w-6 h-6 flex-shrink-0 rounded-full border border-gray-900"
            src={LogoCTUT}
            alt="logo"
          />
        ) : (
          <img
            className="w-6 h-6 rounded-full flex-shrink-0"
            src={LogoCTUT}
            alt="logo"
          />
        ),
      nav: "/department",
      label: "Đoàn khoa",
    },
    {
      icon:
        location.pathname === "/message" ? (
          <PiChatTeardropDotsFill />
        ) : (
          <PiChatTeardropDots />
        ),
      nav: "/message",
      label: "Tin nhắn",
    },
    {
      icon:
        location.pathname === "/notification" ? (
          <PiBellSimpleRingingFill />
        ) : (
          <PiBellSimpleRinging />
        ),
      nav: "/notification",
      label: "Thông báo",
    },
  ];

  return (
    <div
      className={`hidden md:flex flex-col justify-between ${
        location.pathname === "/message" ? "w-20" : "xl:w-1/6 w-20"
      } p-4 border-r border-gray-300 bg-white relative`}
    >
      {/* Logo */}
      <div
        className={`flex items-center h-10 ${
          location.pathname === "/message"
            ? "justify-center"
            : "justify-center xl:justify-start"
        } gap-2`}
      >
        <img
          src={LogoCTUT}
          alt="Logo"
          className={`w-10 ${
            location.pathname === "/message" ? "block" : "xl:hidden block"
          } rounded-full`}
        />
        <span
          className={`text-3xl text_logo ${
            location.pathname === "/message" ? "hidden" : "xl:block hidden"
          } font-semibold`}
        >
          CTUT Connect
        </span>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-4">
        {listNavigate.map((item, index) => (
          <div
            key={index}
            onClick={
              item.onClick ? item.onClick : () => item.nav && navigate(item.nav)
            }
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 cursor-pointer`}
          >
            <div className="text-2xl flex justify-center items-center xl:me-3">
              {item.icon}
            </div>
            <div
              className={`${
                location.pathname === "/message" ? "hidden" : "xl:block hidden"
              }`}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Modal tìm kiếm */}
      {searchContainer && (
        <div className="fixed inset-0 bg-black/30 flex justify-start items-center z-50">
          <div
            ref={searchRef}
            className="bg-white h-full w-[600px] shadow-lg p-6 animate-slide-in-left"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="text-xl font-semibold text-gray-800">
                Tìm kiếm
              </div>

              {/* Nút đóng */}
              <button
                onClick={handleCloseSearchContainer}
                className="flex justify-center items-center cursor-pointer text-xl text-gray-500 hover:text-black"
              >
                <MdOutlineClose />
              </button>
            </div>

            <input
              type="text"
              placeholder="Nhập nội dung tìm kiếm..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
            />

            <div className="mt-4 text-gray-500 text-sm">
              Gợi ý tìm kiếm sẽ hiển thị tại đây...
            </div>
          </div>
        </div>
      )}

      {/* Bottom section */}
      <div className="flex flex-col gap-3 pt-4">
        <div
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-200 rounded-lg"
          onClick={() => navigate("/profile")}
        >
          <img
            className="w-6 h-6 rounded-full xl:me-3"
            src={LogoCTUT}
            alt="Logo"
          />
          <div
            className={`${
              location.pathname === "/message" ? "hidden" : "xl:block hidden"
            }`}
          >
            Trang cá nhân
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-200 rounded-lg">
          <div className="text-2xl flex justify-center items-center xl:me-3">
            <HiOutlineBars3 />
          </div>
          <div
            className={`${
              location.pathname === "/message" ? "hidden" : "xl:block hidden"
            }`}
          >
            Xem thêm
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;
