import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoCTUT from "@/assets/logo/logo-ctut.png";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  HiUserGroup,
  HiOutlineUserGroup,
  HiUsers,
  HiOutlineUsers,
  HiBookmark,
  HiCog6Tooth,
  HiArrowLeftOnRectangle,
} from "react-icons/hi2";
import * as ValidateToken from "@/utils/token.utils";
import * as GroupServices from "@/services/user/GroupServices";
import { useSelector } from "react-redux";

const SidebarGroupDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const user = useSelector((state) => state.user);

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // Lấy group từ API
  // -------------------------------
  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        const accessToken = await ValidateToken.getValidAccessToken();
        const groupId = location.pathname.split("/").pop();
        if (!groupId) return;

        const res = await GroupServices.getGroupDetail(accessToken, groupId);
        setGroup(res.data.group || res.data);
      } catch (err) {
        console.log("Lỗi lấy group:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetail();
  }, [location]);

  const groupsPublic = currentPath.startsWith("/groups/public");
  const groupsMembers = currentPath.startsWith("/groups/members");

  // Kiểm tra user đã tham gia nhóm chưa
  const isMember = group?.groupMember?.includes(user.id);

  // -------------------------------
  // Menu cấu hình theo groupName + groupId
  // -------------------------------
  const menuItems = group
    ? [
        {
          label: "Cộng đồng",
          path: `/groups/public/${group.groupName}/${group._id}`,
          icon: groupsPublic ? <HiUserGroup /> : <HiOutlineUserGroup />,
        },
        // Các mục khác chỉ hiển thị nếu user là thành viên
        ...(isMember && group.groupPrivacy === "approve"
          ? [
              {
                label: "Yêu cầu tham gia",
                path: `/groups/requests/${group.groupName}/${group._id}`,
                icon: <HiBookmark />,
              },
            ]
          : []),
        ...(isMember
          ? [
              {
                label: "Thành viên",
                path: `/groups/members/${group.groupName}/${group._id}`,
                icon: groupsMembers ? <HiUsers /> : <HiOutlineUsers />,
              },
              {
                label: "Cài đặt nhóm",
                path: `/groups/${group.groupName}/${group._id}`,
                icon: <HiCog6Tooth />,
              },
            ]
          : []),
      ]
    : [];

  // -------------------------------
  // Chức năng rời nhóm
  // -------------------------------
  const handleLeaveGroup = async () => {
    if (!group) return;
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      await GroupServices.leaveGroup(accessToken, group._id);
      navigate("/groups/feed");
    } catch (err) {
      console.log("Lỗi rời nhóm:", err);
    }
  };

  // -------------------------------
  // Render UI
  // -------------------------------
  return (
    <div className="h-screen bg-gray-100 p-3">
      <div className="bg-white h-full rounded-xl shadow-md flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center space-x-3 p-4 border-b sticky top-0 bg-white z-10">
          <button
            onClick={() => navigate("/groups/feed")}
            className="p-1 hover:bg-gray-200 rounded-full transition"
          >
            <IoIosArrowRoundBack size={28} />
          </button>

          <img className="w-10 h-10 rounded-full" src={logoCTUT} alt="Logo" />

          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">
              {group?.groupName || "Đang tải..."}
            </span>
            <span className="text-sm text-gray-500">Cộng đồng học tập</span>
          </div>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {loading ? (
            <div className="text-center text-gray-500 py-4">Đang tải...</div>
          ) : (
            <>
              {menuItems.map((item, i) => {
                const isActive = currentPath.startsWith(item.path);
                return (
                  <button
                    key={i}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
                      isActive
                        ? "bg-gray-200 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}

              {/* NÚT RỜI NHÓM chỉ hiển thị nếu là thành viên */}
              {isMember && (
                <div className="pt-3">
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 transition"
                    onClick={handleLeaveGroup}
                  >
                    <HiArrowLeftOnRectangle className="text-xl" />
                    <span className="font-medium">Rời nhóm</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarGroupDetail;
