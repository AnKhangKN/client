import React from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiSearchLine } from "react-icons/ri";

const ActiveFriendsListAndGroupsListComponent = ({
  activeFriendsList,
  groupsList,
}) => {
  return (
    <>
      {/* List active friend */}
      <div>
        <div className="flex py-4 px-2 justify-between items-center">
          <div>Bạn bè hoạt động</div>
          <div className="flex items-center gap-4">
            <div>
              <RiSearchLine />
            </div>
            <div>
              <HiOutlineDotsHorizontal />
            </div>
          </div>
        </div>

        {activeFriendsList.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center gap-3 py-2 px-2 hover:bg-gray-100 cursor-pointer transition"
          >
            <div className="relative">
              <img
                className="w-10 h-10 rounded-full dark:bg-white object-cover"
                src={friend.userAvatar}
                alt={friend.userName}
              />
              {/* chấm xanh online */}
              <span
                className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 
              border-white rounded-full"
              ></span>
            </div>
            <div className="text-sm font-medium">{friend.userName}</div>
          </div>
        ))}
      </div>

      {/* List group */}
      <div>
        <div className="flex py-4 px-2 border-t border-gray-400 justify-between items-center">
          <div>Nhóm chat</div>
          <div className="flex items-center gap-4">
            <div>
              <RiSearchLine />
            </div>
            <div>
              <HiOutlineDotsHorizontal />
            </div>
          </div>
        </div>

        {groupsList.map((group) => (
          <div
            key={group.id}
            className="flex py-2 px-2 hover:bg-gray-200 cursor-pointer items-center gap-4"
          >
            <img
              className="w-10 h-10 rounded-lg dark:bg-white"
              src={group.groupAvatar}
              alt=""
            />

            <div>
              {group.groupName} {group.id}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ActiveFriendsListAndGroupsListComponent;
