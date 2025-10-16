import React from "react";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiMiniUserGroup, HiOutlineUserGroup } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import {
  PiBellSimpleRinging,
  PiBellSimpleRingingFill,
  PiChatTeardropDots,
  PiChatTeardropDotsFill,
} from "react-icons/pi";

const BottomNavbarComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const listNavigate = [
    { icon: location.pathname === "/" ? <GoHomeFill /> : <GoHome />, nav: "/" },
    {
      icon: ["/groups/feed", "/groups/discover", "/groups/join"].includes(
        location.pathname
      ) ? (
        <HiMiniUserGroup />
      ) : (
        <HiOutlineUserGroup />
      ),
      nav: "/groups/feed",
    },
    {
      icon:
        location.pathname === "/department" ? (
          <img
            className="w-6 h-6 rounded-full border border-gray-900"
            src={LogoCTUT}
            alt="logo"
          />
        ) : (
          <img className="w-6 h-6 rounded-full" src={LogoCTUT} alt="logo" />
        ),
      nav: "/department",
    },
    {
      icon:
        location.pathname === "/message" ? (
          <PiChatTeardropDotsFill />
        ) : (
          <PiChatTeardropDots />
        ),
      nav: "/message",
    },
    {
      icon:
        location.pathname === "/notification" ? (
          <PiBellSimpleRingingFill />
        ) : (
          <PiBellSimpleRinging />
        ),
      nav: "/notification",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md py-2 z-50">
      <div className="flex justify-around items-center">
        {listNavigate.map((item, index) => {
          const isActive = location.pathname === item.nav;
          return (
            <div
              key={index}
              onClick={() => navigate(item.nav)}
              className={`flex flex-col items-center text-2xl cursor-pointer ${
                isActive ? "text-gray-600" : "text-gray-700 hover:text-gray-400"
              }`}
            >
              {item.icon}
              {/* dấu chấm dưới icon khi active */}
              <div
                className={`mt-0 w-1 h-1 rounded-full transition-all duration-200 ${
                  isActive ? "bg-gray-600 scale-100" : "bg-transparent scale-0"
                }`}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbarComponent;
