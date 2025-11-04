import React from "react";
import { MdSettings } from "react-icons/md";
import { PiNewspaperClippingFill, PiUserCircleCheckFill } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import { PiNewspaperClippingLight, PiUserCircleCheck } from "react-icons/pi";
import { HiLightBulb, HiOutlineLightBulb } from "react-icons/hi2";
import { RiSearchLine } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";

const SidebarGroupComponent = () => {
  const listGroup = [
    {
      id: "1",
      groupAvatar: LogoCTUT,
      groupName:
        "Nhóm công nghệ thông tin (nếu tên nhóm quá dài vượt qua 1 dòng hiện ...)",
      member: 30000,
      creatAt: "10/10/2024",
    },
    {
      id: "2",
      groupAvatar: LogoCTUT,
      groupName: "Nhóm công nghệ thông tin",
      member: 30000,
      creatAt: "10/10/2024",
    },
    {
      id: "3",
      groupAvatar: LogoCTUT,
      groupName: "Nhóm công nghệ thông tin",
      member: 30000,
      creatAt: "10/10/2024",
    },
    {
      id: "4",
      groupAvatar: LogoCTUT,
      groupName: "Nhóm công nghệ thông tin",
      member: 30000,
      creatAt: "10/10/2024",
    },
    {
      id: "5",
      groupAvatar: LogoCTUT,
      groupName: "Nhóm công nghệ thông tin",
      member: 30000,
      creatAt: "10/10/2024",
    },
    {
      id: "6",
      groupAvatar: LogoCTUT,
      groupName: "Nhóm công nghệ thông tin",
      member: 30000,
      creatAt: "10/10/2024",
    },
    {
      id: "7",
      groupAvatar: LogoCTUT,
      groupName: "Nhóm công nghệ thông tin",
      member: 30000,
      creatAt: "10/10/2024",
    },
    {
      id: "8",
      groupAvatar: LogoCTUT,
      groupName: "Nhóm công nghệ thông tin",
      member: 30000,
      creatAt: "10/10/2024",
    },
    {
      id: "9",
      groupAvatar: LogoCTUT,
      groupName: "Nhóm công nghệ thông tin",
      member: 30000,
      creatAt: "10/10/2024",
    },
    {
      id: "10",
      groupAvatar: LogoCTUT,
      groupName: "Nhóm công nghệ thông tin",
      member: 30000,
      creatAt: "10/10/2024",
    },
    {
      id: "11",
      groupAvatar: LogoCTUT,
      groupName: "Nhóm công nghệ thông tin",
      member: 30000,
      creatAt: "10/10/2024",
    },
    {
      id: "12",
      groupAvatar: LogoCTUT,
      groupName: "Nhóm công nghệ thông tin",
      member: 30000,
      creatAt: "10/10/2024",
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const listNavigate = [
    {
      icon:
        location.pathname === "/groups/feed" ? (
          <PiNewspaperClippingFill />
        ) : (
          <PiNewspaperClippingLight />
        ),
      label: "Bảng tin",
      nav: "/groups/feed",
    },
    {
      icon:
        location.pathname === "/groups/discover" ? (
          <HiLightBulb />
        ) : (
          <HiOutlineLightBulb />
        ),
      label: "Khám phá",
      nav: "/groups/discover",
    },
    {
      icon:
        location.pathname === "/groups/join" ? (
          <PiUserCircleCheckFill />
        ) : (
          <PiUserCircleCheck />
        ),
      label: "Nhóm của bạn",
      nav: "/groups/join",
    },
  ];

  return (
    <div
      className="md:flex hidden flex-col lg:w-[320px] w-24 p-4 dark:bg-[#1c1c1d] dark:text-white
    dark:border-0 border-l border-gray-200 overflow-hidden "
    >
      <div className="flex lg:justify-between justify-center items-center py-4">
        <div className="lg:block hidden text-xl">Nhóm</div>

        <div
          className="flex justify-center items-center w-12 h-12 rounded-full text-2xl
        bg-gray-200 dark:bg-[#303030]"
        >
          <MdSettings />
        </div>
      </div>

      <div className="overflow-y-auto scrollbar-hide">
        <div className="flex items-center bg-gray-200 dark:bg-[#303030] mx-2 gap-2 rounded-full">
          <div className="flex justify-center text-xl p-3 items-center">
            <RiSearchLine />
          </div>
          <div className="lg:block hidden">Tìm kiếm</div>
        </div>

        {listNavigate.map((item, index) => (
          <div
            className="flex items-center gap-2 mt-4 cursor-pointer hover:bg-gray-200 px-3 rounded-lg"
            key={index}
            onClick={() => navigate(item.nav)}
          >
            <div className="w-10 h-10 text-2xl flex justify-center items-center">
              {item.icon}
            </div>
            <div className="lg:block hidden">{item.label}</div>
          </div>
        ))}

        <button
          className="flex w-full justify-center items-center mt-4 mb-6 
        gap-2 dark:bg-[#303030] bg-gray-200 py-2 rounded-lg"
        >
          <div className="flex justify-center items-center text-2xl">
            <GoPlus />
          </div>
          <div className="lg:block hidden">Tạo nhóm mới</div>
        </button>

        {/* List group */}

        {listGroup.map((group) => (
          <div
            key={group.id}
            className="flex items-center gap-2 p-3 hover:bg-gray-200 rounded-lg"
          >
            <img
              className="w-10 h-10 dark:bg-white rounded-full"
              src={group.groupAvatar}
              alt="logo"
            />

            <div className="flex-col w-full lg:flex hidden">
              <div className="font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[215px]">
                {group.groupName}
              </div>

              <div className="flex justify-between items-center text-gray-600 text-sm">
                <div>{group.member}</div>
                <div>{group.creatAt}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarGroupComponent;
