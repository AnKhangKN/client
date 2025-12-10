import React, { useEffect, useState } from "react";
import AvatarDefault from "../../../assets/logo/avatar_default.webp";
import * as ValidateToken from "@/utils/token.utils";
import * as UserServices from "../../../services/user/UserServices";
import * as notificationServices from "@/services/shared/NotificationServices";
import { formatVietnamTime } from "@/utils/formatVietnamTime";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const [friendsSuggest, setFriendsSuggest] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchFriendsSuggest = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      const res = await UserServices.getFriendSuggest(accessToken);

      setFriendsSuggest(res.data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getNotification = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      const res = await notificationServices.getNotification(accessToken);

      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFriendsSuggest();
    getNotification();
  }, []);

  return (
    <div className="bg-white dark:bg-[#1c1c1d] dark:text-white flex justify-center min-h-screen">
      <div className="w-full max-w-[800px] p-4">
        {/* Tiêu đề */}
        <div className="md:hidden block text-xl font-semibold mb-4">
          Thông báo
        </div>

        {/* Danh sách thông báo */}
        <div className="mb-6">
          <div className="text-base font-medium mb-2">Thông báo cho bạn</div>
          <div className="flex flex-col gap-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() =>
                  navigate(
                    `${
                      notification.post
                        ? `/post/${notification.post}`
                        : `/profile/${notification.sender.userName}`
                    }`
                  )
                }
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 
                cursor-pointer dark:hover:text-[#1c1c1c] transition"
              >
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={notification.sender.userAvatar || AvatarDefault}
                  alt={notification.sender.userName}
                />
                <div className="flex flex-col">
                  <span className="text-sm leading-snug">
                    <span className="font-medium">
                      {notification.sender.userName}
                    </span>{" "}
                    {notification.message}
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">
                    {formatVietnamTime(notification.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gợi ý bạn có thể quen */}
        <div className="border-t pt-4">
          <div className="text-base font-medium mb-2">
            Gợi ý bạn có thể quen
          </div>

          <div className="flex flex-col">
            {friendsSuggest.map((suggest) => (
              <div
                key={suggest._id}
                onClick={() => navigate(`/profile/${suggest.userName}`)}
                className="flex justify-between items-center py-3 hover:bg-gray-50
                cursor-pointer dark:hover:text-[#1c1c1c] px-2 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={suggest.userAvatar || AvatarDefault}
                    alt={suggest.userName}
                  />
                  <div className="font-medium text-sm">{suggest.userName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
