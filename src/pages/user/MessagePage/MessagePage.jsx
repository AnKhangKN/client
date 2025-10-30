import React, { useState } from "react";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import { BsEmojiWink, BsImage, BsPencilSquare } from "react-icons/bs";
import { RiSearchLine } from "react-icons/ri";
import { CiCircleInfo } from "react-icons/ci";
import { VscSend } from "react-icons/vsc";

const MessagePage = () => {
  const [message, setMessage] = useState("");

  const listActiveFriends = [
    { id: "1", memberAvatar: LogoCTUT, memberName: "Khang" },
    { id: "2", memberAvatar: LogoCTUT, memberName: "Linh" },
    { id: "3", memberAvatar: LogoCTUT, memberName: "Phúc" },
    { id: "4", memberAvatar: LogoCTUT, memberName: "An" },
    { id: "5", memberAvatar: LogoCTUT, memberName: "Trang" },
    { id: "6", memberAvatar: LogoCTUT, memberName: "Duy" },
    { id: "7", memberAvatar: LogoCTUT, memberName: "Hà" },
    { id: "8", memberAvatar: LogoCTUT, memberName: "Tú" },
  ];

  const listGroup = [
    { id: "1", groupAvatar: LogoCTUT, groupName: "Web" },
    { id: "2", groupAvatar: LogoCTUT, groupName: "Mobile" },
    { id: "3", groupAvatar: LogoCTUT, groupName: "AI" },
  ];

  return (
    <div className="flex h-screen dark:bg-[#1c1c1d] dark:text-white">
      {/* Sidebar danh sách bạn bè và nhóm */}
      <div
        className="lg:w-[350px] w-[100px] border-r border-gray-200 dark:border-gray-600 
      flex flex-col"
      >
        <div className="overflow-y-auto flex-1 p-3 scrollbar-hide">
          {/* Danh sách bạn bè hoạt động */}
          <div className="mb-6">
            <div className="flex items-center justify-between px-3 py-4">
              <div className="lg:block hidden">Bạn bè đang hoạt động</div>
              <div className="flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-lg text-2xl h-10 w-10">
                <BsPencilSquare />
              </div>
            </div>

            <div
              className="flex items-center justify-center ms-2 lg:justify-start py-4 h-12 w-12 
            lg:w-[300px] bg-gray-200 dark:bg-[#303030] rounded-full my-4"
            >
              <div className="flex justify-center items-center w-12 h-12 text-xl">
                <RiSearchLine />
              </div>
              <div className="lg:block hidden">Tìm kiếm</div>
            </div>

            <div className="flex flex-col gap-2">
              {listActiveFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <div className="relative">
                    <div className="bg-white w-12 h-12 rounded-full overflow-hidden border">
                      <img
                        className="w-full h-full object-cover"
                        src={friend.memberAvatar}
                        alt={friend.memberName}
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="lg:block hidden text-sm font-medium">
                    {friend.memberName}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danh sách nhóm */}
          <div>
            <div className="lg:block hidden font-semibold mb-2 px-2">
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
                      className="w-full h-full object-cover "
                      src={group.groupAvatar}
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
      </div>

      {/* Khu vực chat chính */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-20 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between px-4">
          <div className="flex items-center gap-4 text-lg">
            <div className="bg-white w-12 h-12 rounded-full overflow-hidden">
              <img className="w-full h-full " src={LogoCTUT} alt="" />
            </div>
            <div className="flex flex-col">
              <div className="text-sm">Khang</div>
              <div className="text-[12px] text-gray-500">_khang13</div>
            </div>
          </div>
          <div className="text-3xl hover:bg-gray-200 p-2 cursor-pointer">
            <CiCircleInfo />
          </div>
        </div>

        {/* Nội dung chat */}
        <div className="flex-1 flex flex-col md:mb-0 mb-10 overflow-hidden h-screen">
          <div className="overflow-y-auto p-4">
            <div className="h-screen">text</div>
            <div>text</div>
          </div>

          {/* input */}
          <div className="h-20 p-4">
            <div className="border border-gray-600 flex items-center w-full rounded-full px-1">
              <input
                className="px-2 mx-2 w-full outline-0"
                type="text"
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              {message.trim() ? (
                <div className="flex justify-center items-center p-2 text-2xl text-blue-600 cursor-pointer hover:text-blue-700">
                  <VscSend />
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="flex justify-center items-center p-2 text-2xl cursor-pointer">
                    <BsImage />
                  </div>
                  <div className="flex justify-center items-center p-2 text-2xl cursor-pointer">
                    <BsEmojiWink />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
