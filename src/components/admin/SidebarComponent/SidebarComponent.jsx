import React from "react";
import AvatarDefault from "../../../assets/logo/avatar_default.webp";
import {
  HiMiniUserGroup,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi2";
import {
  PiBellSimpleRinging,
  PiBellSimpleRingingFill,
  PiChatTeardropDots,
  PiChatTeardropDotsFill,
} from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import { RiDashboard3Fill, RiDashboard3Line } from "react-icons/ri";
import "./style.css";
import {
  IoInformationCircleOutline,
  IoInformationCircleSharp,
  IoNewspaperOutline,
  IoNewspaperSharp,
} from "react-icons/io5";

const SidebarComponent = ({ isShowSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const listNavigate = [
    {
      icon:
        location.pathname === "/admin" ? (
          <RiDashboard3Fill />
        ) : (
          <RiDashboard3Line />
        ),
      nav: "/admin",
      label: "Tổng quan",
    },
    {
      icon:
        location.pathname === "/admin/user" ? <HiUser /> : <HiOutlineUser />,
      nav: "/admin/user",
      label: "Quản lý người dùng",
    },
    {
      icon:
        location.pathname === "/admin/posts" ? (
          <IoNewspaperSharp />
        ) : (
          <IoNewspaperOutline />
        ),
      nav: "/admin/posts",
      label: "Quản lý bài viết",
    },
    {
      icon:
        location.pathname === "/admin/groups" ? (
          <HiMiniUserGroup />
        ) : (
          <HiOutlineUserGroup />
        ),
      nav: "/admin/groups",
      label: "Quản lý nhóm",
    },

    {
      icon:
        location.pathname === "/admin/department" ? (
          <img
            className="w-6 h-6 shrink-0 rounded-full border border-gray-900 bg-white"
            src={AvatarDefault}
            alt="logo"
          />
        ) : (
          <img
            className="w-6 h-6 rounded-full shrink-0 bg-white"
            src={AvatarDefault}
            alt="logo"
          />
        ),
      nav: "/admin/department",
      label: "Quản lý đoàn khoa",
    },
    {
      icon:
        location.pathname === "/admin/message" ? (
          <IoInformationCircleSharp />
        ) : (
          <IoInformationCircleOutline />
        ),
      nav: "/admin/message",
      label: "Phản hồi và thông báo",
    },
    {
      icon:
        location.pathname === "/admin/notification" ? (
          <PiBellSimpleRingingFill />
        ) : (
          <PiBellSimpleRinging />
        ),
      nav: "/admin/notification",
      label: "Thông báo",
    },
  ];

  return (
    <div
      className={`hidden md:flex flex-col gap-4 p-4 border-r border-gray-300 relative
      transition-all duration-500 ease-in-out
      ${isShowSidebar ? "xl:w-80 w-64" : "xl:w-20 w-20"}
      bg-white`}
    >
      {/* Logo */}
      <div className="flex items-center h-10 gap-2 px-1 pt-5 py-14">
        <img src={AvatarDefault} alt="Logo" className="w-10 rounded-full" />
        <span
          className={`text-3xl text_logo font-semibold overflow-hidden transition-all duration-1000 ease-in-out
          xl:block hidden
          ${isShowSidebar ? "opacity-100 w-auto" : "opacity-0 w-0"}
        `}
        >
          CTUT Connect
        </span>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-3">
        {listNavigate.map((item, index) => (
          <div
            key={index}
            onClick={() => item.nav && navigate(item.nav)}
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 cursor-pointer
              transition-all duration-300 ease-in-out
            `}
          >
            <div className="text-2xl flex justify-center items-center xl:me-3">
              {item.icon}
            </div>
            <div
              className={`whitespace-nowrap transition-all duration-500 ease-in-out xl:block hidden
                ${
                  isShowSidebar
                    ? "opacity-100 w-auto"
                    : "opacity-0 w-0 overflow-hidden"
                }
              `}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarComponent;
