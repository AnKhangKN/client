import React from "react";
import AvatarDefault from "../../../assets/logo/avatar_default.webp";
import { MdSettings } from "react-icons/md";
import { useSelector } from "react-redux";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto rounded-lg my-10">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Avatar */}
        <div className="relative group">
          <img
            className="w-36 h-36 rounded-full object-cover border-4 border-gray-200 shadow-sm"
            src={user.userAvatar || AvatarDefault}
            alt="User avatar"
          />
          <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white text-2xl cursor-pointer">
            <MdSettings />
          </div>
        </div>

        {/* User Info */}
        <div className="flex flex-col gap-4 w-full md:w-3/4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 gap-4">
            {/* Tên */}
            <div className="text-2xl font-semibold text-gray-800 flex gap-2">
              <span>{user.lastName}</span>
              <span>{user.firstName}</span>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-wrap items-center gap-3">
              <ButtonComponent
                text="Chỉnh sửa hồ sơ"
                onClick={() => navigate("/admin/profile/edit")}
                textSize="text-sm"
                bgColor="bg-gray-100"
                textColor="text-gray-800"
                hoverColor="hover:bg-gray-200"
                width="w-40"
              />
              <ButtonComponent
                text="Bảo mật"
                onClick={() => navigate("/admin/profile/security")}
                textSize="text-sm"
                bgColor="bg-gray-100"
                textColor="text-gray-800"
                hoverColor="hover:bg-gray-200"
                width="w-24"
              />
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="border-t border-gray-300 pt-4 text-gray-700 text-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-medium text-gray-600 w-32">
                Tên người dùng:
              </span>
              <span>{user.userName}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-medium text-gray-600 w-32">Email:</span>
              <span>{user.email}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
              <span className="font-medium text-gray-600 w-32">
                Giới thiệu:
              </span>
              <span className="text-gray-800">
                {user.bio?.trim() ? user.bio : "Chưa có giới thiệu."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
