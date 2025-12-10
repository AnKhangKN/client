import React, { useState, useRef, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import { searchUserAndGroup } from "@/services/shared/SearchServices";
import * as ValidateToken from "@/utils/token.utils";
import AvatarDefault from "@/assets/logo/avatar_default.webp";
import GroupAvatarDefault from "@/assets/logo/group_avatar_default.webp";
import { useNavigate } from "react-router-dom";

const SearchModal = ({ closeSearchModal, searchRef }) => {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState({ users: [], groups: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const debounceRef = useRef(null);

  // debounce tìm kiếm
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!keyword.trim()) {
        setSuggestions({ users: [], groups: [] });
        return;
      }

      setLoading(true);
      try {
        const accessToken = await ValidateToken.getValidAccessToken();

        const res = await searchUserAndGroup(keyword, accessToken);
        setSuggestions(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [keyword]);

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-start items-center z-50">
      <div
        ref={searchRef}
        className="bg-white h-full w-[600px] shadow-lg p-6 animate-slide-in-left overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-semibold text-gray-800">Tìm kiếm</div>
          <button
            onClick={closeSearchModal}
            className="flex justify-center items-center cursor-pointer text-xl text-gray-500 hover:text-black"
          >
            <MdOutlineClose />
          </button>
        </div>

        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Nhập nội dung tìm kiếm..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
        />

        {loading && (
          <div className="mt-2 text-gray-500 text-sm">Đang tải...</div>
        )}

        {!loading &&
          (suggestions.users.length > 0 || suggestions.groups.length > 0) && (
            <div className="mt-4 border-t pt-2 max-h-[400px] overflow-y-auto">
              {suggestions.users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => navigate(`/profile/${user.userName}`)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={user.userAvatar || AvatarDefault}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              ))}

              {suggestions.groups.map((group) => (
                <div
                  key={group._id}
                  onClick={() =>
                    navigate(`/groups/public/${group.groupName}/${group._id}`)
                  }
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={group.groupAvatar || GroupAvatarDefault}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{group.groupName}</span>
                </div>
              ))}
            </div>
          )}

        {!loading &&
          keyword &&
          suggestions.users.length === 0 &&
          suggestions.groups.length === 0 && (
            <div className="mt-4 text-gray-500 text-sm">
              Không tìm thấy kết quả.
            </div>
          )}
      </div>
    </div>
  );
};

export default SearchModal;
