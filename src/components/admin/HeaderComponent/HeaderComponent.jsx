import React, { useState, useRef } from "react";
import { HiBars3, HiBars3BottomLeft } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import { PiBellSimpleRingingLight, PiMoonLight } from "react-icons/pi";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import useClickOutsideForPosition from "../../../hooks/useClickOutsideForPosition";
import * as TokenUtils from "../../../utils/token.utils";
import * as AuthServices from "../../../services/shared/AuthServices";
import MessageComponent from "../../shared/MessageComponent/MessageComponent";

const HeaderComponent = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSubModal, setSubModal] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const [isOpenNotify, setIsOpenNotify] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState({
    type: "",
    text: "",
    key: 0,
  });

  const notifyRef = useRef(null);
  const subModalRef = useRef(null);
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

  const handleOpenSubModal = () => setSubModal((prev) => !prev);
  const handleOpenModalLogout = () => setModalLogout(true);
  const handleCloseModalLogout = () => setModalLogout(false);
  const handleToggleNotify = () => setIsOpenNotify((prev) => !prev);

  useClickOutsideForPosition(notifyRef, () => setIsOpenNotify(false));
  useClickOutsideForPosition(subModalRef, () => setSubModal(false));

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const accessToken = await TokenUtils.getValidAccessToken();

      await AuthServices.logoutServices(accessToken);

      localStorage.removeItem("accessToken");

      setMessage({
        type: "success",
        text: "Đăng xuất thành công!",
        key: Date.now(),
      });

      setTimeout(() => navigate("/login"), 2000);

      setIsSuccess(true);
    } catch (error) {
      setMessage({
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Đăng xuất thất bại",
        type: "error",
        key: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="shrink-0 py-4 border-b border-gray-200 bg-white shadow">
      {message.text && (
        <MessageComponent
          type={message.type}
          message={message.text}
          key={message.key}
        />
      )}

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

          {/* Notification */}
          <div className="relative" ref={notifyRef}>
            <div
              onClick={handleToggleNotify}
              className="text-2xl cursor-pointer hover:bg-gray-200 p-2 rounded-full transition-all duration-300 active:scale-90 relative"
            >
              <PiBellSimpleRingingLight />
              <div className="absolute top-0 right-0 bg-blue-600 rounded-full w-5 h-5 flex justify-center items-center">
                <span className="text-[10px] text-white">1</span>
              </div>
            </div>

            {/* Modal Notification */}
            <div
              className={`absolute top-12 w-[360px] flex flex-col gap-4 rounded-sm border border-gray-200
                right-0 bg-white shadow-lg p-4 transform transition-all duration-200 ease-in-out z-10 
              ${
                isOpenNotify
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-2 invisible"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>Thông báo cho bạn.</div>
                <div>
                  <HiOutlineDotsHorizontal className="cursor-pointer" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                  Thông báo 1
                </div>
                <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                  Thông báo 2
                </div>
                <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                  Thông báo 3
                </div>
              </div>
            </div>
          </div>

          {/* Avatar + Menu */}
          <div className="relative ms-8" ref={subModalRef}>
            <img
              src={LogoCTUT}
              onClick={handleOpenSubModal}
              className="w-8 h-8 cursor-pointer rounded-full hover:ring-2 hover:ring-gray-300 transition-all duration-300"
              alt="Logo_info"
            />

            {/* Sub Modal */}
            <div
              className={`absolute flex border border-gray-200 z-10 flex-col w-52 end-0 top-11 bg-white rounded-lg 
                shadow-lg overflow-hidden transform transition-all duration-200 ease-in-out p-2
              ${
                isSubModal
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-2 invisible"
              }`}
            >
              <div
                onClick={() => navigate("/admin/profile")}
                className="p-2 hover:bg-gray-200 rounded-sm cursor-pointer transition-all"
              >
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
              <div className="fixed z-10 top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/50">
                <div className="bg-white flex flex-col p-6 gap-6 rounded-lg">
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
                    <ButtonComponent
                      text="Đăng xuất"
                      onClick={handleLogout}
                      isLoading={isLoading}
                      disabled={isSuccess}
                    />
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
