import React, { useState } from "react";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import { BsPencilSquare } from "react-icons/bs";
import { RiSearchLine } from "react-icons/ri";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";

const SidebarMessageComponent = ({
  chatList = [],
  user,
  handleSelectUser,
  listGroup = [],
}) => {
  const [modalCreateGroupChat, setModalCreateGroupChat] = useState(false);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");

  // Mở modal tạo nhóm
  const handleOpenCreateGroupChat = () => {
    setModalCreateGroupChat(true);
  };

  // Đóng modal
  const handleCloseCreateGroupChat = () => {
    setModalCreateGroupChat(false);
    setMembers([]);
    setGroupName("");
  };

  // Tạo nhóm chat (mock)
  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert("Vui lòng nhập tên nhóm!");
      return;
    }
    if (members.length < 2) {
      alert("Nhóm cần ít nhất 2 thành viên!");
      return;
    }

    const payload = {
      groupName,
      members: members.map((m) => m._id),
    };

    console.log("Tạo nhóm:", payload);

    handleCloseCreateGroupChat();
  };

  return (
    <div className="lg:w-[350px] w-[100px] border-r border-gray-200 dark:border-gray-600 flex flex-col">
      <div className="overflow-y-auto flex-1 p-3 scrollbar-hide">
        {/* Bạn bè */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-3 py-4">
            <div className="lg:block hidden font-semibold text-gray-700">
              Bạn bè đang hoạt động
            </div>
            <div
              className="flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-lg 
             text-2xl h-10 w-10"
              onClick={handleOpenCreateGroupChat}
            >
              <BsPencilSquare />
            </div>
          </div>

          <div className="flex items-center justify-center ms-2 lg:justify-start py-4 h-12 w-12 lg:w-[300px] bg-gray-200 dark:bg-[#303030] rounded-full my-4">
            <div className="flex justify-center items-center w-12 h-12 text-xl">
              <RiSearchLine />
            </div>
            <div className="lg:block hidden text-gray-500">Tìm kiếm</div>
          </div>

          <div className="flex flex-col gap-2">
            {chatList.map((chat) => {
              const friend = chat.members.find((m) => m._id !== user.id);
              if (!friend) return null;

              return (
                <div
                  key={chat._id}
                  onClick={() =>
                    handleSelectUser(
                      friend.userAvatar,
                      friend.lastName,
                      friend.firstName,
                      friend.userName,
                      chat._id
                    )
                  }
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <div className="relative">
                    <div className="bg-white w-12 h-12 rounded-full overflow-hidden border">
                      <img
                        className="w-full h-full object-cover"
                        src={friend.userAvatar || LogoCTUT}
                        alt={friend.name}
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="lg:block hidden text-sm font-medium">
                    <div>
                      {friend.lastName} {friend.firstName}
                    </div>
                    <div className="text-gray-400 text-[12px]">
                      {friend.userName}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nhóm */}
        <div>
          <div className="lg:block hidden font-semibold mb-2 px-2 text-gray-700">
            Nhóm đã tham gia
          </div>
          <div className="flex flex-col gap-2">
            {listGroup.map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              >
                <div className="bg-white w-12 h-12 rounded-lg border overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={group.groupAvatar || LogoCTUT}
                    alt={group.groupName}
                  />
                </div>
                <div className="lg:block hidden text-sm font-medium">
                  {group.groupName}
                </div>
              </div>
            ))}
          </div>
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

            {/* Ô nhập tìm kiếm và tên nhóm */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2
              focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-100"
                />
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nhập tên nhóm..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2
              focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Thành viên đã chọn */}
            {members.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {members.map((m) => (
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

            {/* Danh sách bạn bè */}
            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Chọn thành viên:
              </p>
              <div
                className="overflow-y-auto h-72 border border-gray-200 dark:border-gray-700 
              rounded-lg p-2 flex flex-col gap-2"
              >
                {chatList.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-4">
                    Không có bạn bè nào.
                  </div>
                )}
                {chatList.map((chat) => {
                  const friend = chat.members.find((m) => m._id !== user.id);
                  if (!friend) return null;

                  const isChecked = members.some((m) => m._id === friend._id);

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
                          if (e.target.checked)
                            setMembers((prev) => [...prev, friend]);
                          else
                            setMembers((prev) =>
                              prev.filter((m) => m._id !== friend._id)
                            );
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
