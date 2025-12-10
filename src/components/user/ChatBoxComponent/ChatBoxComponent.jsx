import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { RiSearchLine } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import "./style.css";
import MessageBoxComponent from "../MessageBoxComponent/MessageBoxComponent";
import GroupMessageBoxComponent from "../GroupMessageBoxComponent/GroupMessageBoxComponent";
import AvatarDefault from "../../../assets/logo/avatar_default.webp";

const ChatBoxComponent = ({ listFriends }) => {
  const [modal, setModal] = useState(false);
  const [activeFriendId, setActiveFriendId] = useState(null);

  const handleOpenModal = () => setModal(true);
  const handleCloseModal = () => {
    setModal(false);
    setActiveFriendId(null);
  };

  const handleOpenMessageBox = (friendId) => setActiveFriendId(friendId);
  const handleCloseMessageBox = () => setActiveFriendId(null);

  return (
    <div className="relative">
      {/* 🔘 Nút mở chat */}
      {!modal && (
        <button
          onClick={handleOpenModal}
          className="bg-white cursor-pointer px-4 py-3 shadow-lg hover:bg-gray-700 hover:text-white transition-all"
        >
          Chat box component
        </button>
      )}

      {/* 🪟 Modal Chat */}
      {modal && (
        <div
          className="absolute bottom-0 right-0 bg-white shadow-xl rounded-t-xl h-[500px] w-96 overflow-hidden 
          flex flex-col animate-slide-up"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-800">Tin nhắn</h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-600 cursor-pointer hover:text-gray-800"
            >
              <MdOutlineClose size={22} />
            </button>
          </div>

          {/* Nội dung cuộn */}
          <div className="flex-1 scrollbar-hide overflow-y-auto">
            {/* --- Bạn bè hoạt động --- */}
            <div className="px-4 py-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Bạn bè hoạt động
                </h3>
                <div className="flex items-center gap-3 text-gray-500">
                  <RiSearchLine className="cursor-pointer" />
                  <HiOutlineDotsHorizontal className="cursor-pointer" />
                </div>
              </div>

              {listFriends.map((friend) => (
                <div key={friend._id}>
                  <div
                    onClick={() => handleOpenMessageBox(friend._id)}
                    className="flex items-center gap-3 py-2 hover:bg-gray-100 rounded-lg px-2 cursor-pointer transition"
                  >
                    <div className="relative">
                      <img
                        className="w-10 h-10 rounded-full object-cover"
                        src={friend.userAvatar || AvatarDefault}
                        alt={friend.userName}
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="text-gray-800 text-sm font-medium">
                      {friend.userName}
                    </div>
                  </div>

                  {activeFriendId === friend._id && (
                    <MessageBoxComponent
                      handleCloseMessageBox={handleCloseMessageBox}
                      userName={friend.userName}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* --- Nhóm chat --- */}
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Nhóm chat</h3>
                <div className="flex items-center gap-3 text-gray-500">
                  <RiSearchLine className="cursor-pointer" />
                  <HiOutlineDotsHorizontal className="cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBoxComponent;
