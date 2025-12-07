import React, { useEffect, useState } from "react";
import { MdSettings } from "react-icons/md";
import { PiNewspaperClippingFill, PiUserCircleCheckFill } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import { PiNewspaperClippingLight, PiUserCircleCheck } from "react-icons/pi";
import { HiLightBulb, HiOutlineLightBulb } from "react-icons/hi2";
import { RiSearchLine } from "react-icons/ri";
import { GoPlus } from "react-icons/go";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import * as ValidateToken from "@/utils/token.utils";
import * as GroupServices from "@/services/user/GroupServices";
import { formatVietnamTime } from "@/utils/formatVietnamTime";

const SidebarGroupComponent = () => {
  const location = useLocation();
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
  ];

  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroupJoin = async () => {
      try {
        const accessToken = await ValidateToken.getValidAccessToken();

        const res = await GroupServices.getGroupsJoin(accessToken);

        setGroups(res.groups);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGroupJoin();
  }, []);

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
          onClick={() => navigate("/groups/create")}
          className="flex w-full justify-center items-center mt-4 mb-6 cursor-pointer
        gap-2 dark:bg-[#303030] bg-gray-200 py-2 rounded-lg"
        >
          <div className="flex justify-center items-center text-2xl">
            <GoPlus />
          </div>
          <div className="lg:block hidden">Tạo nhóm mới</div>
        </button>

        {/* List group */}
        {groups && (
          <div>
            {groups.map((group) => (
              <div
                key={group._id}
                onClick={() =>
                  navigate(`/groups/public/${group.groupName}/${group._id}`)
                }
                className="flex items-center gap-2 p-3 hover:bg-gray-200 rounded-lg"
              >
                <img
                  className="w-10 h-10 dark:bg-white rounded-full"
                  src={group.groupAvatar || LogoCTUT}
                  alt="logo"
                />

                <div className="flex-col w-full lg:flex hidden">
                  <div className="font-bold text-ellipsis overflow-hidden whitespace-nowrap max-w-[215px]">
                    {group.groupName}
                  </div>

                  <div className="flex justify-between items-center text-gray-600 text-sm">
                    <div>{group.groupMember.length}</div>
                    <div>{formatVietnamTime(group.createdAt)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarGroupComponent;
