import React, { useEffect, useState } from "react";
import * as ValidateToken from "@/utils/token.utils";
import * as GroupServices from "@/services/user/GroupServices";
import defaultGroupAvatar from "@/assets/logo/logo-ctut.png"; // ảnh default

const DiscoverPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupNotJoin = async () => {
      try {
        const accessToken = await ValidateToken.getValidAccessToken();
        const res = await GroupServices.getGroupsNotJoined(accessToken);
        setGroups(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupNotJoin();
  }, []);

  return (
    <div className="dark:bg-[#1c1c1d] dark:text-white min-h-screen p-6">
      <h2 className="text-2xl font-semibold mb-4">Gợi ý nhóm</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : groups.length === 0 ? (
        <p>Không có nhóm nào để hiển thị.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group._id}
              className="bg-white dark:bg-[#2c2c2c] rounded-lg shadow-md p-4 flex flex-col items-center text-center"
            >
              <img
                src={group.groupAvatar || defaultGroupAvatar}
                alt={group.groupName}
                className="w-20 h-20 rounded-full mb-3 object-cover"
              />
              <h3 className="font-semibold text-lg">{group.groupName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {group.groupMember?.length || 0} thành viên
              </p>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={() =>
                  (window.location.href = `/groups/public/${group.groupName}/${group._id}`)
                }
              >
                Xem nhóm
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
