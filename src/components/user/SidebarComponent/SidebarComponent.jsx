import React, { useState, useRef } from "react";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import {
  HiOutlineBars3,
  HiMiniUserGroup,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { GoHome, GoHomeFill, GoReport } from "react-icons/go";
import {
  PiBellSimpleRinging,
  PiBellSimpleRingingFill,
  PiChatTeardropDots,
  PiChatTeardropDotsFill,
  PiCloudSunThin,
  PiMoonLight,
} from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import { MdOutlineClose } from "react-icons/md";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { IoSettingsOutline } from "react-icons/io5";
import { BsActivity, BsAppIndicator } from "react-icons/bs";
import useClickOutside from "../../../hooks/useClickOutside";
import * as AuthServices from "../../../services/shared/AuthServices";
import MessageComponent from "../../../components/shared/MessageComponent/MessageComponent";
import * as TokenUtils from "../../../utils/token.utils";
import { toggleTheme } from "../../../features/theme/themeSlice";
import { socket } from "../../../utils/socket";

const SidebarComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchContainer, setSearchContainer] = useState(false);
  const searchRef = useRef(null);
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme.mode);
  const [modalMore, setModalMore] = useState(false);
  const moreRef = useRef(null);
  const [message, setMessage] = useState({
    text: "",
    type: "",
    key: 1,
  });

  // Mở / Đóng modal tìm kiếm
  const handleOpenSearchContainer = () => setSearchContainer(true);
  const handleCloseSearchContainer = () => setSearchContainer(false);

  const handleOpenModalMore = () => {
    setModalMore(true);
  };

  useClickOutside(searchRef, searchContainer, () => setSearchContainer(false));
  useClickOutside(moreRef, modalMore, () => setModalMore(false));

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
        location.pathname === "/department/feed" ? (
          <img
            className="w-6 h-6 shrink-0 rounded-full border border-gray-900 dark:border-white bg-white"
            src={LogoCTUT}
            alt="logo"
          />
        ) : (
          <img
            className="w-6 h-6 shrink-0 rounded-full bg-white"
            src={LogoCTUT}
            alt="logo"
          />
        ),
      nav: "/department/feed",
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

  const activities = [
    {
      label: "Cài đặt",
      icon: <IoSettingsOutline />,
      action: () => navigate("/accounts/edit"),
    },
    { label: "Hoạt động của bạn", icon: <BsActivity /> },
    {
      label: theme === "light" ? "Chuyển chế độ tối" : "Chuyển chế độ sáng",
      icon: theme === "light" ? <PiMoonLight /> : <PiCloudSunThin />,
      action: () => dispatch(toggleTheme()),
    },
    { label: "Báo cáo sự cố", icon: <GoReport /> },
  ];

  const handleLogout = async () => {
    try {
      const accessToken = await TokenUtils.getValidAccessToken();

      await AuthServices.logoutServices(accessToken);

      localStorage.removeItem("accessToken");
      socket.emit("logout", user.id);
      socket.disconnect();

      setMessage({
        text: "Đăng xuất thành công!",
        type: "success",
        key: Date.now(),
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage({
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Đăng xuất thất bại",
        type: "error",
        key: Date.now(),
      });
    }
  };

  return (
    <div
      className={`hidden md:flex flex-col justify-between bg-white dark:bg-[#1c1c1d] dark:text-white ${
        location.pathname === "/message" ||
        location.pathname === "/groups/feed" ||
        location.pathname === "/groups/discover" ||
        location.pathname === "/groups/join"
          ? "w-20"
          : "xl:w-1/6 w-20"
      } p-4 border-r border-gray-300 dark:border-0 relative`}
    >
      {message.text && (
        <MessageComponent
          key={message.key}
          type={message.type}
          message={message.text}
        />
      )}

      {/* Logo */}
      <div
        className={`flex items-center h-10 ${
          location.pathname === "/message" ||
          location.pathname === "/groups/feed" ||
          location.pathname === "/groups/discover" ||
          location.pathname === "/groups/join"
            ? "justify-center"
            : "justify-center xl:justify-start"
        } gap-2`}
      >
        <img
          src={LogoCTUT}
          alt="Logo"
          className={`w-10 ${
            location.pathname === "/message" ||
            location.pathname === "/groups/feed" ||
            location.pathname === "/groups/discover" ||
            location.pathname === "/groups/join"
              ? "block"
              : "xl:hidden block"
          } rounded-full`}
        />
        <span
          className={`text-3xl text_logo ${
            location.pathname === "/message" ||
            location.pathname === "/groups/feed" ||
            location.pathname === "/groups/discover" ||
            location.pathname === "/groups/join"
              ? "hidden"
              : "xl:block hidden"
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
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200
              dark:hover:bg-[#3c3c3c] cursor-pointer`}
          >
            <div className="text-2xl flex justify-center items-center xl:me-3">
              {item.icon}
            </div>
            <div
              className={`${
                location.pathname === "/message" ||
                location.pathname === "/groups/feed" ||
                location.pathname === "/groups/discover" ||
                location.pathname === "/groups/join"
                  ? "hidden"
                  : "xl:block hidden"
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
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-200
          dark:hover:bg-[#3c3c3c] rounded-lg"
          onClick={() =>
            navigate(user.isAdmin ? "/admin" : `/profile/${user.userName}`)
          }
        >
          <img
            className="w-6 h-6 rounded-full bg-white xl:me-3"
            src={LogoCTUT}
            alt="Logo"
          />
          <div
            className={`${
              location.pathname === "/message" ||
              location.pathname === "/groups/feed" ||
              location.pathname === "/groups/discover" ||
              location.pathname === "/groups/join"
                ? "hidden"
                : "xl:block hidden"
            }`}
          >
            {user.firstName}
          </div>
        </div>

        <div className="relative">
          <div
            onClick={handleOpenModalMore}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-200
            dark:hover:bg-[#3c3c3c] rounded-lg"
          >
            <div className="text-2xl flex justify-center items-center xl:me-3">
              <HiOutlineBars3 />
            </div>
            <div
              className={`${
                location.pathname === "/message" ||
                location.pathname === "/groups/feed" ||
                location.pathname === "/groups/discover" ||
                location.pathname === "/groups/join"
                  ? "hidden"
                  : "xl:block hidden"
              }`}
            >
              Xem thêm
            </div>
          </div>

          {modalMore && (
            <div
              ref={moreRef}
              className="absolute bottom-13 w-60 shadow-lg flex flex-col gap-1 overflow-hidden 
                        rounded-xl bg-gray-200 dark:bg-[#353535] z-10"
            >
              <div className="bg-white dark:bg-[#262626] rounded-t-xl">
                {activities.map((item, i) => (
                  <div
                    key={i}
                    onClick={item.action}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-200
                              dark:hover:bg-[#3c3c3c] py-3 px-3.5"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col bg-white dark:bg-[#262626] rounded-b-xl">
                <div
                  onClick={handleLogout}
                  className="p-3 px-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#3c3c3c]"
                >
                  Đăng xuất
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;
