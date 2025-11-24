import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { BsActivity, BsAppIndicator, BsPersonCircle } from "react-icons/bs";
import { MdBlockFlipped } from "react-icons/md";
import { PiShieldCheckLight } from "react-icons/pi";
import { VscMention } from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarAccountComponent = () => {
  const listNav = [
    {
      label: "Chỉnh sửa trang cá nhân",
      icon: <BsPersonCircle />,
      nav: "/accounts/edit",
    },
    {
      label: "Thẻ và lượt nhắc",
      icon: <VscMention />,
      nav: "/accounts/tags_and_mentions",
    },
    {
      label: "Hoạt động của bạn",
      icon: <BsActivity />,
      nav: "/accounts/activities",
    },
    {
      label: "Bảo mật tài khoản",
      icon: <PiShieldCheckLight />,
      nav: "/accounts/security",
    },
    {
      label: "Đã chặn",
      icon: <MdBlockFlipped />,
      nav: "/accounts/blocked_accounts",
    },
    {
      label: "Xóa tài khoản",
      icon: <AiFillDelete />,
      nav: "/accounts/delete_account",
    },
  ];
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden border-r border-gray-200">
      <div className="h-screen overflow-y-auto flex flex-col px-4 pt-6 gap-18">
        <div className="text-xl font-bold">Cài đặt</div>

        <div className="flex flex-col gap-2">
          {listNav.map((nav, idx) => (
            <div
              className={`flex items gap-2.5 hover:bg-gray-200 px-4 py-3 rounded-lg cursor-pointer 
                ${location.pathname === nav.nav ? "bg-gray-200" : "bg-white"}`}
              onClick={() => navigate(nav.nav)}
              key={idx}
            >
              <div className="text-2xl">{nav.icon}</div>
              <div>{nav.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarAccountComponent;
