import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AvatarDefault from "@/assets/logo/avatar_default.webp";
import * as ValidateToken from "@/utils/token.utils";
import * as UserServices from "@/services/user/UserServices";

const BlockedAccounts = () => {
  const [activeTab, setActiveTab] = useState("blocked"); // blocked | hidden
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [hiddenUsers, setHiddenUsers] = useState([]);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user?.friendsHidden) {
      setBlockedUsers(
        user.friendsHidden
          .filter((f) => f.type === "block")
          .map((f) => f.friendId)
      );

      setHiddenUsers(
        user.friendsHidden
          .filter((f) => f.type === "hidden")
          .map((f) => f.friendId)
      );
    }
  }, [user]);

  const handleUnblock = async (id) => {
    try {
      setBlockedUsers(blockedUsers.filter((u) => u._id !== id));
      // TODO: gọi API để cập nhật server
      const accessToken = await ValidateToken.getValidAccessToken();

      const res = await UserServices.deleteUserHidden(accessToken, id);

      if (res) {
        alert("Bỏ chặn thành công!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnhide = async (id) => {
    try {
      setHiddenUsers(hiddenUsers.filter((u) => u._id !== id));
      // TODO: gọi API để cập nhật server
      const accessToken = await ValidateToken.getValidAccessToken();

      const res = await UserServices.deleteUserHidden(accessToken, id);

      if (res) {
        alert("Bỏ ẩn thành công!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 w-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <div
          className={`cursor-pointer px-4 py-2 transition-all ${
            activeTab === "blocked"
              ? "border-b-2"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("blocked")}
        >
          Người dùng đã chặn
        </div>
        <div
          className={`cursor-pointer px-4 py-2 transition-all ${
            activeTab === "hidden"
              ? "border-b-2"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("hidden")}
        >
          Người dùng đã ẩn
        </div>
      </div>

      {/* Nội dung tab */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 min-h-[150px]">
        {activeTab === "blocked" &&
          (blockedUsers.length === 0 ? (
            <div className="text-gray-600">Chưa có người dùng nào bị chặn.</div>
          ) : (
            blockedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user.userAvatar || AvatarDefault}
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-gray-700">
                    {user.firstName} {user.lastName}
                  </div>
                </div>
                <button
                  onClick={() => handleUnblock(user._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  Bỏ chặn
                </button>
              </div>
            ))
          ))}

        {activeTab === "hidden" &&
          (hiddenUsers.length === 0 ? (
            <div className="text-gray-600">Chưa có người dùng nào bị ẩn.</div>
          ) : (
            hiddenUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user.userAvatar || AvatarDefault}
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-gray-700">
                    {user.firstName} {user.lastName}
                  </div>
                </div>
                <button
                  onClick={() => handleUnhide(user._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                >
                  Hiện lại
                </button>
              </div>
            ))
          ))}
      </div>
    </div>
  );
};

export default BlockedAccounts;
