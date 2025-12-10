import React, { useState, useRef, useEffect } from "react";
import { HiBars3, HiBars3BottomLeft } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import AvatarDefault from "../../../assets/logo/avatar_default.webp";
import { PiBellSimpleRingingLight, PiMoonLight } from "react-icons/pi";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import useClickOutsideForPosition from "../../../hooks/useClickOutsideForPosition";
import * as TokenUtils from "../../../utils/token.utils";
import * as AuthServices from "../../../services/shared/AuthServices";
import * as NotificationServices from "@/services/shared/NotificationServices";
import MessageComponent from "../../shared/MessageComponent/MessageComponent";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const HeaderComponent = ({ toggleSidebar }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(true);
  const [isSubModal, setIsSubModal] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const [isOpenNotify, setIsOpenNotify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "", key: 0 });
  const [notifications, setNotifications] = useState([]);

  const notifyRef = useRef(null);
  const subModalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const listLocation = [
    { path: "/admin", text: "Tổng quan" },
    { path: "/admin/user", text: "Quản lý người dùng" },
    { path: "/admin/groups", text: "Quản lý nhóm" },
    { path: "/admin/department", text: "Quản lý đoàn khoa" },
    { path: "/admin/message", text: "Quản lý tin nhắn" },
  ];

  // Lấy thông báo
  const fetchNotification = async () => {
    try {
      const accessToken = await TokenUtils.getValidAccessToken();
      if (!accessToken) return;

      const res = await NotificationServices.getNotificationAdmin(accessToken);
      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  const handleToggleSidebar = () => {
    setIsOpenSidebar((prev) => !prev);
    toggleSidebar();
  };

  const handleOpenSubModal = () => setIsSubModal((prev) => !prev);
  const handleToggleNotify = () => setIsOpenNotify((prev) => !prev);
  const handleOpenModalLogout = () => setModalLogout(true);
  const handleCloseModalLogout = () => setModalLogout(false);

  useClickOutsideForPosition(notifyRef, () => setIsOpenNotify(false));
  useClickOutsideForPosition(subModalRef, () => setIsSubModal(false));

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const accessToken = await TokenUtils.getValidAccessToken();
      if (!accessToken) throw new Error("Token không tồn tại");

      await AuthServices.logoutServices(accessToken);
      localStorage.removeItem("accessToken");

      setMessage({
        type: "success",
        text: "Đăng xuất thành công!",
        key: Date.now(),
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Đăng xuất thất bại",
        key: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const readNotification = async (notificationId, noti) => {
    try {
      const accessToken = await TokenUtils.getValidAccessToken();
      if (!accessToken) return;

      await NotificationServices.readNotification(accessToken, notificationId);

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );

      if (noti.type === "message") {
        navigate("/admin/message");
      } else if (noti.user) {
        navigate("/admin/user");
      } else if (noti.group) {
        navigate("/admin/group");
      } else if (noti.post) {
        navigate("/admin/post");
      }

      setIsOpenNotify(false);
    } catch (error) {
      console.log(error);
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
        {/* Left */}
        <div className="flex items-center gap-4">
          <div
            className="text-2xl cursor-pointer p-2 rounded-full hover:bg-gray-200 transition-all duration-300 active:scale-90"
            onClick={handleToggleSidebar}
          >
            {isOpenSidebar ? <HiBars3 /> : <HiBars3BottomLeft />}
          </div>

          {listLocation.map(
            (item, idx) =>
              item.path === location.pathname && (
                <div key={idx} className="text-lg font-medium">
                  {item.text}
                </div>
              )
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 relative">
          {/* Dark mode icon */}
          <div className="text-2xl cursor-pointer hover:bg-gray-200 p-2 rounded-full">
            <PiMoonLight />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifyRef}>
            <div
              onClick={handleToggleNotify}
              className="text-2xl cursor-pointer hover:bg-gray-200 p-2 rounded-full relative"
            >
              <PiBellSimpleRingingLight />
              {notifications.filter((n) => !n.isRead).length > 0 && (
                <div className="absolute top-0 right-0 bg-blue-600 rounded-full w-5 h-5 flex justify-center items-center">
                  <span className="text-[10px] text-white">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                </div>
              )}
            </div>

            {/* Modal notifications */}
            <div
              className={`absolute top-12 w-[360px] z-10 rounded-sm border border-gray-200
              right-0 bg-white shadow-lg p-4 transition-all duration-200
              ${
                isOpenNotify
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-2 invisible"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div>Thông báo cho bạn</div>
                <HiOutlineDotsHorizontal className="cursor-pointer" />
              </div>

              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-gray-500 text-sm">
                    Không có thông báo
                  </div>
                ) : (
                  notifications.map((noti) => (
                    <div
                      key={noti._id}
                      onClick={() => readNotification(noti._id, noti)}
                      className={`hover:bg-gray-100 p-2 rounded cursor-pointer ${
                        !noti.isRead ? "bg-gray-200" : "bg-white"
                      }`}
                    >
                      {noti.sender.lastName} {noti.sender.firstName}{" "}
                      {noti.message || "Thông báo mới"}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div className="relative" ref={subModalRef}>
            <img
              src={AvatarDefault}
              onClick={handleOpenSubModal}
              className="w-8 h-8 cursor-pointer rounded-full hover:ring-2 hover:ring-gray-300 transition"
            />

            {/* Sub menu */}
            <div
              className={`absolute flex flex-col w-52 end-0 top-11 bg-white border border-gray-200 rounded-lg shadow-lg p-2 transition-all duration-200
                ${
                  isSubModal
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 -translate-y-2 invisible"
                }`}
            >
              <div
                onClick={() => navigate("/admin/profile")}
                className="p-2 hover:bg-gray-200 rounded cursor-pointer"
              >
                Trang cá nhân
              </div>
              <div
                onClick={handleOpenModalLogout}
                className="p-2 hover:bg-gray-200 rounded cursor-pointer"
              >
                Đăng xuất
              </div>
            </div>

            {/* Modal Logout */}
            {modalLogout && (
              <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-10">
                <div className="bg-white p-6 rounded-lg flex flex-col gap-6">
                  <div className="text-xl">
                    Bạn có chắc chắn muốn đăng xuất?
                  </div>
                  <div className="flex justify-between gap-4">
                    <ButtonComponent
                      text="Hủy"
                      bgColor="bg-white"
                      textColor="text-black"
                      hoverColor="hover:bg-gray-100"
                      onClick={handleCloseModalLogout}
                    />
                    <ButtonComponent
                      text="Đăng xuất"
                      onClick={handleLogout}
                      isLoading={isLoading}
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
