import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { AiOutlineCamera, AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import logoCTUT from "../../../../assets/logo/logo-ctut.png";
import ButtonComponent from "../../../../components/shared/ButtonComponent/ButtonComponent";
import InputComponent from "../../../../components/shared/InputComponent/InputComponent";
import TextareaComponent from "../../../../components/shared/TextareaComponent/TextareaComponent";

const CreateGroupPage = () => {
  const navigate = useNavigate();

  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [inviteText, setInviteText] = useState("");
  const [isInviteFocused, setIsInviteFocused] = useState(false);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const friendsList = [
    {
      _id: 1,
      userAvatar: logoCTUT,
      firstName: "Phan",
      lastName: "Khang",
      userName: "pkhang",
    },
    {
      _id: 2,
      userAvatar: logoCTUT,
      firstName: "Nguyen",
      lastName: "Huy",
      userName: "huynguyen",
    },
    {
      _id: 3,
      userAvatar: logoCTUT,
      firstName: "Tran",
      lastName: "Linh",
      userName: "linhtran",
    },
    {
      _id: 4,
      userAvatar: logoCTUT,
      firstName: "Pham",
      lastName: "Minh",
      userName: "minhpn",
    },
    {
      _id: 5,
      userAvatar: logoCTUT,
      firstName: "Do",
      lastName: "Quang",
      userName: "quangdo",
    },
    {
      _id: 6,
      userAvatar: logoCTUT,
      firstName: "Le",
      lastName: "Son",
      userName: "sonle",
    },
  ];

  const avatarPreview = avatarFile ? URL.createObjectURL(avatarFile) : logoCTUT;
  const coverPreview = coverFile ? URL.createObjectURL(coverFile) : null;

  // Lọc bạn bè
  const filteredFriends =
    inviteText.trim() === ""
      ? friendsList
      : friendsList.filter((item) =>
          item.userName.toLowerCase().includes(inviteText.toLowerCase())
        );

  const addMember = (friend) => {
    if (!selectedMembers.some((m) => m._id === friend._id)) {
      setSelectedMembers([...selectedMembers, friend]);
    }
    setInviteText("");
  };

  const handleCreateGroup = () => {
    navigate("/groups/feed");
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100 dark:bg-[#121212]">
      {/* LEFT SIDEBAR */}
      <div className="w-[350px] bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between shadow-xl">
        <div className="space-y-6">
          {/* Back */}
          <div className="text-gray-600 dark:text-gray-400 text-sm flex gap-4 items-center">
            <button
              onClick={() => navigate("/groups/feed")}
              className="text-4xl text-gray-700 dark:text-gray-200 hover:text-blue-500 transition"
            >
              <IoIosArrowRoundBack />
            </button>
            <div>Nhóm &gt; Tạo nhóm</div>
          </div>

          <div className="text-xl font-semibold dark:text-white">Tạo nhóm</div>

          {/* User */}
          <div className="flex items-center gap-3">
            <img className="w-12 h-12 rounded-full" src={logoCTUT} alt="" />
            <div>
              <div className="font-semibold dark:text-white">Phan An Khang</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Quản trị viên
              </div>
            </div>
          </div>

          {/* FORM INPUT */}
          <div className="space-y-6">
            {/* Group Name */}
            <InputComponent label="Tên nhóm" />

            {/* Group Type */}
            <select className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 dark:bg-[#2a2a2a] dark:text-gray-100 shadow-sm">
              <option value="public">Công khai</option>
              <option value="private">Cần kiểm duyệt</option>
            </select>

            {/* Invite friends */}
            <div className="relative">
              <InputComponent
                label="Mời bạn bè"
                value={inviteText}
                onChange={(e) => setInviteText(e.target.value)}
                onFocus={() => setIsInviteFocused(true)}
                onBlur={() => setTimeout(() => setIsInviteFocused(false), 200)}
              />

              {/* Popup */}
              {isInviteFocused && (
                <div className="absolute z-20 bg-white dark:bg-[#2a2a2a] w-full mt-1 p-2 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                  {filteredFriends.length === 0 && (
                    <div className="p-3 text-sm text-gray-600 dark:text-gray-300">
                      Không tìm thấy bạn bè
                    </div>
                  )}

                  {filteredFriends.map((friend) => (
                    <div
                      key={friend._id}
                      onClick={() => addMember(friend)}
                      className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-[#3a3a3a] transition"
                    >
                      <img
                        src={friend.userAvatar}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-sm dark:text-white">
                          {friend.lastName} {friend.firstName}
                        </div>
                        <div className="text-[12px] text-gray-500 dark:text-gray-400">
                          {friend.userName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Members */}
            <div className="overflow-hidden border dark:border-gray-700 rounded-xl">
              <div className="overflow-y-auto max-h-64 p-3 flex flex-col gap-3">
                {selectedMembers.length === 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                    Chưa chọn thành viên
                  </div>
                )}

                {selectedMembers.map((member) => (
                  <div key={member._id} className="flex items-center gap-3">
                    <img
                      src={member.userAvatar}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="text-sm dark:text-white">
                        {member.lastName} {member.firstName}
                      </div>
                      <div className="text-[12px] text-gray-500 dark:text-gray-400">
                        {member.userName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex justify-center p-6">
        <div className="w-full max-w-2xl bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl overflow-hidden">
          {/* Cover image */}
          <div className="relative h-48">
            {coverPreview ? (
              <img src={coverPreview} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                Ảnh nền nhóm
              </div>
            )}

            {coverPreview && (
              <button
                onClick={() => setCoverFile(null)}
                className="absolute top-3 left-3 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <AiOutlineCloseCircle className="text-red-500 text-xl" />
              </button>
            )}

            <label className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg cursor-pointer">
              <AiOutlineCamera className="text-xl text-gray-700 dark:text-gray-300" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCoverFile(e.target.files[0])}
              />
            </label>
          </div>

          <div className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <img
                  src={avatarPreview}
                  className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
                />

                {avatarFile && (
                  <button
                    onClick={() => setAvatarFile(null)}
                    className="absolute top-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow"
                  >
                    <AiOutlineCloseCircle className="text-red-500 text-lg" />
                  </button>
                )}

                <label className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 p-3 rounded-full shadow cursor-pointer">
                  <AiOutlineCamera className="text-xl text-gray-700 dark:text-gray-300" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <TextareaComponent label="Mô tả nhóm" />
            </div>

            {/* Create button */}
            <div className="flex justify-end">
              <ButtonComponent
                text="Tạo nhóm"
                onClick={handleCreateGroup}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage;
