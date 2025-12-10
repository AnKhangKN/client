import React from "react";
import AvatarDefault from "../../../assets/logo/avatar_default.webp";
import "./style.css";
import { RiSearchLine } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";

const HeaderComponent = () => {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow z-10">
      <div className="flex justify-between items-center p-4 h-14">
        <div className="flex items-center gap-4">
          <img
            className="w-10 h-10 rounded-full bg-white"
            src={AvatarDefault}
            alt=""
          />
          <div className="text_logo text-2xl">CTUT Connect</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center cursor-pointer sm:w-48 bg-gray-200 rounded-full">
            <div className="flex justify-center items-center p-2">
              <RiSearchLine />
            </div>
            <div className="sm:block hidden text-sm">Tìm kiếm</div>
          </div>

          <div className="relative">
            <img className="w-8 h-8 rounded-full" src={AvatarDefault} alt="" />

            <div className="absolute right-0 bottom-0 flex justify-center items-center w-3 h-3 rounded-full bg-gray-100 border-2 border-white">
              <IoIosArrowDown />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
