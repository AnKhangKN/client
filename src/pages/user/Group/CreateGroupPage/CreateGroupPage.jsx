import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { AiOutlineCamera, AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import logoCTUT from "../../../../assets/logo/logo-ctut.png";
import ButtonComponent from "../../../../components/shared/ButtonComponent/ButtonComponent";

const CreateGroupPage = () => {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupType, setGroupType] = useState("public");
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const avatarPreview = avatarFile ? URL.createObjectURL(avatarFile) : logoCTUT;
  const coverPreview = coverFile ? URL.createObjectURL(coverFile) : null;

  const handleCreateGroup = () => {
    console.log({ groupName, groupDesc, groupType, avatarFile, coverFile });
    navigate("/groups/feed");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#121212] p-4 relative">
      {/* Back button */}
      <div
        onClick={() => navigate("/groups/feed")}
        className="absolute top-4 left-4 text-4xl cursor-pointer text-gray-700 dark:text-gray-200 hover:text-blue-500 transition"
      >
        <IoIosArrowRoundBack />
      </div>

      <div className="max-w-2xl mx-auto bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Cover Image */}
        <div className="relative h-44">
          {coverPreview ? (
            <img
              src={coverPreview}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-lg">
              Ảnh nền nhóm
            </div>
          )}

          {coverPreview && (
            <button
              onClick={() => setCoverFile(null)}
              className="absolute top-3 left-3 bg-white dark:bg-gray-800 p-1 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <AiOutlineCloseCircle className="text-red-500 text-2xl" />
            </button>
          )}

          <label className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-2 rounded-full cursor-pointer shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <AiOutlineCamera className="text-xl text-gray-600 dark:text-gray-300" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setCoverFile(e.target.files[0])}
            />
          </label>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28">
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
              />

              {avatarFile && (
                <button
                  onClick={() => setAvatarFile(null)}
                  className="absolute top-0 right-0 bg-white dark:bg-gray-800 p-1 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <AiOutlineCloseCircle className="text-red-500 text-xl" />
                </button>
              )}

              <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer">
                <AiOutlineCamera className="text-xl text-gray-600 dark:text-gray-300" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                />
              </label>
            </div>

            <input
              type="text"
              placeholder="Tên nhóm"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-[#2a2a2a] dark:text-gray-100 shadow-md"
            />
          </div>

          {/* Group Type */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Chế độ nhóm
            </label>
            <select
              value={groupType}
              onChange={(e) => setGroupType(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-[#2a2a2a] dark:text-gray-100 shadow-sm"
            >
              <option value="public">Công khai</option>
              <option value="private">Cần kiểm duyệt</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
              Giới thiệu nhóm
            </label>
            <textarea
              rows={4}
              placeholder="Viết mô tả ngắn về nhóm..."
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-[#2a2a2a] dark:text-gray-100 shadow-sm resize-none"
            />
          </div>

          {/* Create Button */}
          <div className="flex justify-end">
            <ButtonComponent
              text="Tạo nhóm"
              onClick={handleCreateGroup}
              className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage;
