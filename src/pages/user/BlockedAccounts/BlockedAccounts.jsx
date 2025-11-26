import React, { useState } from "react";

const mockBlockedUsers = [
  { id: 1, name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, name: "Trần Thị B", avatar: "https://i.pravatar.cc/40?img=2" },
];

const mockHiddenUsers = [
  { id: 1, name: "Lê Văn C", avatar: "https://i.pravatar.cc/40?img=3" },
  { id: 2, name: "Phạm Thị D", avatar: "https://i.pravatar.cc/40?img=4" },
];

const BlockedAccounts = () => {
  const [activeTab, setActiveTab] = useState("blocked"); // blocked | hidden
  const [blockedUsers, setBlockedUsers] = useState(mockBlockedUsers);
  const [hiddenUsers, setHiddenUsers] = useState(mockHiddenUsers);

  const handleUnblock = (id) => {
    setBlockedUsers(blockedUsers.filter((user) => user.id !== id));
  };

  const handleUnhide = (id) => {
    setHiddenUsers(hiddenUsers.filter((user) => user.id !== id));
  };

  return (
    <div className="p-6 w-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <div
          className={`cursor-pointer px-4 py-2 transition-all ${
            activeTab === "blocked"
              ? "border-b-2"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("blocked")}
        >
          Người dùng đã chặn
        </div>
        <div
          className={`cursor-pointer px-4 py-2 transition-all ${
            activeTab === "hidden"
              ? "border-b-2"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("hidden")}
        >
          Người dùng đã ẩn
        </div>
      </div>

      {/* Nội dung tab */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 min-h-[150px]">
        {activeTab === "blocked" && (
          <div className="flex flex-col space-y-4">
            {blockedUsers.length === 0 ? (
              <div className="text-gray-600">
                Chưa có người dùng nào bị chặn.
              </div>
            ) : (
              blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="text-gray-700">{user.name}</div>
                  </div>
                  <button
                    onClick={() => handleUnblock(user.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    Bỏ chặn
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "hidden" && (
          <div className="flex flex-col space-y-4">
            {hiddenUsers.length === 0 ? (
              <div className="text-gray-600">Chưa có người dùng nào bị ẩn.</div>
            ) : (
              hiddenUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="text-gray-700">{user.name}</div>
                  </div>
                  <button
                    onClick={() => handleUnhide(user.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                  >
                    Hiện lại
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockedAccounts;
