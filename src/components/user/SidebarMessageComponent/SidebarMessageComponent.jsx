import React, { useState, useMemo } from "react";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import { BsPencilSquare } from "react-icons/bs";
import { RiSearchLine } from "react-icons/ri";
import * as ChatServices from "../../../services/shared/ChatServices";
import * as ValidateToken from "../../../utils/token.utils";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";

const SidebarMessageComponent = ({
  chatList = [],
  friends = [],
  user,
  handleSelectUser,
}) => {
  const [modalCreateGroupChat, setModalCreateGroupChat] = useState(false);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);

  // Mở modal tạo nhóm
  const handleOpenCreateGroupChat = () => setModalCreateGroupChat(true);

  // Đóng modal
  const handleCloseCreateGroupChat = () => {
    setModalCreateGroupChat(false);
    setMembers([]);
    setGroupName("");
  };

  // Tạo nhóm chat
  const handleCreateGroup = async () => {
    if (members.length < 2) {
      alert("Nhóm cần ít nhất 2 thành viên!");
      return;
    }

    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const memberIds = members.map((m) => m._id);

      const payload = {
        groupName,
        members: memberIds,
      };

      const res = await ChatServices.createGroupChat(accessToken, payload);
      console.log("Tạo nhóm thành công:", res);

      handleCloseCreateGroupChat();
    } catch (error) {
      console.log(error);
    }
  };

  // Lọc unique members để tránh duplicate khi render
  const uniqueMembers = useMemo(
    () => Array.from(new Map(members.map((m) => [m._id, m])).values()),
    [members]
  );

  // Lấy tên chat hiển thị: groupName hoặc 2 người đầu tiên ngoài user
  const getChatName = (chat) => {
    if (chat.groupName) return chat.groupName;

    const members = chat.members || [];

    // Lấy tên 2 người đầu tiên để hiển thị: loại bỏ chính user (nếu muốn)
    const otherMembersForNames = members.filter((m) => m._id !== user.id);
    const firstTwo = otherMembersForNames.slice(0, 2);

    const names = firstTwo
      .map((m) => `${m.lastName} ${m.firstName}`)
      .join(", ");

    // Tổng số thành viên để tính "và X người khác" (không trừ ai)
    const totalMembersCount = members.length;

    // Số người còn lại = tổng - 2 (vì 2 người đã hiển thị)
    const moreCount = Math.max(0, totalMembersCount - 2);

    if (!names) {
      // Nếu không có tên nào để hiển thị (ví dụ chỉ có mình trong members sau khi filter),
      // fallback: hiển thị tổng thành viên
      return totalMembersCount > 1
        ? `${totalMembersCount} thành viên`
        : "1 người";
    }

    if (moreCount <= 0) return names;

    return `${names} và ${moreCount} người khác`;
  };

  return (
    <div className="lg:w-[350px] w-[100px] border-r border-gray-200 dark:border-gray-600 flex flex-col">
      <div className="overflow-y-auto flex-1 p-3 scrollbar-hide">
        {/* Header và mở modal tạo nhóm */}
        <div className="flex items-center justify-between px-3 py-4 mb-6">
          <div className="lg:block hidden font-semibold text-gray-700">
            Tin nhắn
          </div>
          <div
            className="flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-lg text-2xl h-10 w-10"
            onClick={handleOpenCreateGroupChat}
          >
            <BsPencilSquare />
          </div>
        </div>

        {/* Search bar */}
        <div className="flex items-center justify-center ms-2 lg:justify-start py-4 h-12 w-12 lg:w-[300px] bg-gray-200 dark:bg-[#303030] rounded-full my-4">
          <div className="flex justify-center items-center w-12 h-12 text-xl">
            <RiSearchLine />
          </div>
          <div className="lg:block hidden text-gray-500">Tìm kiếm</div>
        </div>

        {/* Chat list (1:1 + group) */}
        <div className="flex flex-col gap-2">
          {chatList.map((chat) => {
            // Chat 1:1
            const friend = chat.members.find((m) => m._id !== user.id);

            return (
              <div
                key={chat._id}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                  selectedChatId === chat._id
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                }`}
                onClick={() => {
                  setSelectedChatId(chat._id);

                  const friend = chat.members.find((m) => m._id !== user.id);
                  friend &&
                    handleSelectUser(
                      friend.userAvatar,
                      friend.lastName,
                      friend.firstName,
                      friend.userName,
                      chat._id,
                      getChatName(chat),
                      chat.members,
                      chat.groupAdmin
                    );
                }}
              >
                <div className="relative">
                  <div
                    className={`bg-white overflow-hidden border ${
                      chat.groupName
                        ? "w-12 h-12 rounded-lg"
                        : "w-12 h-12 rounded-full"
                    }`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={chat.groupAvatar || friend?.userAvatar || LogoCTUT}
                      alt={getChatName(chat)}
                    />
                  </div>
                  {!chat.groupName && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="lg:block hidden text-sm font-medium">
                  {getChatName(chat)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal tạo nhóm */}
      {modalCreateGroupChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#1f1f1f] shadow-2xl rounded-2xl w-full max-w-lg p-6 flex flex-col gap-4 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Tạo nhóm chat
              </h2>
              <button
                onClick={handleCloseCreateGroupChat}
                className="text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Nhập tên nhóm */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Tên nhóm..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2
                focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-100"
              />
            </div>

            {/* Thành viên đã chọn */}
            {uniqueMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {uniqueMembers.map((m) => (
                  <div
                    key={m._id}
                    className="flex items-center gap-2 bg-blue-50 dark:bg-[#2d3748] px-3 py-1 rounded-full shadow-sm"
                  >
                    <img
                      src={m.userAvatar || LogoCTUT}
                      alt={m.userName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                      {m.lastName} {m.firstName}
                    </span>
                    <button
                      onClick={() =>
                        setMembers((prev) =>
                          prev.filter((mem) => mem._id !== m._id)
                        )
                      }
                      className="text-gray-400 hover:text-red-500 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Danh sách bạn bè chọn thành viên */}
            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Chọn thành viên:
              </p>
              <div className="overflow-y-auto h-72 border border-gray-200 dark:border-gray-700 rounded-lg p-2 flex flex-col gap-2">
                {friends.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-4">
                    Không có bạn bè nào.
                  </div>
                )}
                {friends.map((friend) => {
                  const isChecked = uniqueMembers.some(
                    (m) => m._id === friend._id
                  );
                  return (
                    <div
                      key={friend._id}
                      className={`flex justify-between items-center py-3 p-4 rounded-lg transition ${
                        isChecked
                          ? "bg-blue-100 dark:bg-blue-900/40"
                          : "hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                      }`}
                    >
                      <div className="flex gap-3 items-center">
                        <img
                          src={friend.userAvatar || LogoCTUT}
                          alt={friend.userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-800 dark:text-gray-100">
                            {friend.lastName} {friend.firstName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {friend.userName}
                          </div>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMembers((prev) => {
                              if (prev.some((m) => m._id === friend._id))
                                return prev;
                              return [...prev, friend];
                            });
                          } else {
                            setMembers((prev) =>
                              prev.filter((m) => m._id !== friend._id)
                            );
                          }
                        }}
                        className="accent-blue-500 w-4 h-4"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-4 border-t pt-3">
              <ButtonComponent onClick={handleCreateGroup} text="Tạo nhóm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarMessageComponent;
