import React, { useEffect, useState } from "react";
import { MdCloseFullscreen } from "react-icons/md";
import * as ValidateToken from "../../../utils/token.utils";
import * as UserServices from "../../../services/user/UserServices";
import AvatarDefault from "../../../assets/logo/avatar_default.webp";

const GroupChatCreateComponent = ({ handleCloseGroupChatCreate }) => {
  const [friends, setFriends] = useState([]);

  const fetchFriends = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      const res = await UserServices.getFriends(accessToken);

      setFriends(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div
      className="fixed bottom-12 lg:bottom-0 lg:right-20 right-5 w-96 bg-white border border-gray-200 
    rounded-t-lg"
    >
      <div className="flex items-center justify-between px-4 py-2">
        <div>Tạo nhóm</div>
        <div className="cursor-pointer" onClick={handleCloseGroupChatCreate}>
          <MdCloseFullscreen />
        </div>
      </div>

      <div className="px-4 py-2 flex items-center gap-2">
        <div>Thêm: </div>
        <input className="outline-0 w-full" type="text" />
      </div>

      <div className="overflow-hidden px-4 py-2 border-t border-gray-200">
        <div className="h-96 overflow-y-scroll py-2">
          {friends.map((friend) => (
            <div key={friend._id} className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10">
                <img src={friend.userAvatar || AvatarDefault} alt="" />
              </div>

              <div>
                <div>
                  {friend.lastName} {friend.firstName}
                </div>
                <div className="text-[12px]">{friend.userName}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupChatCreateComponent;
