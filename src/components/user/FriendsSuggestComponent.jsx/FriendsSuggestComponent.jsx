import React, { useRef, useState, useEffect } from "react";
import ButtonComponent from "../../shared/ButtonComponent/ButtonComponent";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import AvatarDefault from "../../../assets/logo/avatar_default.webp";
import * as UserServices from "../../../services/user/UserServices";
import * as ValidateToken from "../../../utils/token.utils";
import { useDispatch, useSelector } from "react-redux";
import { updateFollowingList } from "../../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import * as NotificationServices from "@/services/shared/NotificationServices";

const FriendsSuggestComponent = ({ friendsSuggest }) => {
  const scrollRef = useRef(null);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState([]);

  const scrollAmount = 270; // độ dài mỗi lần cuộn (bằng 1 card)

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  // Kiểm tra vị trí scroll để bật/tắt nút prev/next
  const checkScrollPosition = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;

    setCanScrollPrev(scrollLeft > 0);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition(); // gọi lần đầu

    return () => el.removeEventListener("scroll", checkScrollPosition);
  }, []);

  // Cập nhật lại kiểm tra khi danh sách bạn bè thay đổi
  useEffect(() => {
    if (friendsSuggest?.length) {
      setFriends(friendsSuggest.map((f) => ({ ...f, isFollowing: false })));
    }
  }, [friendsSuggest]);

  // Khi render danh sách xong, kiểm tra lại có thể cuộn được không
  useEffect(() => {
    checkScrollPosition();
  }, [friends]);

  const handleFollowFriend = async (friendId) => {
    setLoading(true);
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const res = await UserServices.followFriend(accessToken, { friendId });

      const isFollowing = res.isFollowing; // từ BE trả về

      if (isFollowing) {
        const data = {
          isAdmin: true,
          type: "report",
          message: "đã gửi report về người dùng.",
        };

        await NotificationServices.createNotification(accessToken, data);
      }

      setFriends((prev) => {
        const updated = prev.map((f) =>
          f._id === friendId ? { ...f, isFollowing } : f
        );

        // người đang follow lên đầu
        updated.sort(
          (a, b) => (b.isFollowing ? 1 : 0) - (a.isFollowing ? 1 : 0)
        );
        return updated;
      });

      dispatch(updateFollowingList({ friendId, isFollowing }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleHiddenFriend = async (friendId) => {
    setLoading(true);
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      await UserServices.hiddenOrBlockFriend(accessToken, {
        friendId,
        type: "hidden",
      });

      setFriends((prev) => prev.filter((f) => f._id !== friendId));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6 p-4 rounded-xl bg-gray-100 dark:bg-[#2a2a2a] shadow relative">
      <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
        Gợi ý theo dõi
      </h3>

      <div className="relative">
        {/* Nút Prev */}
        {canScrollPrev && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer
                       bg-white dark:bg-gray-700 p-2 rounded-full shadow z-30"
          >
            <FiChevronLeft size={22} />
          </button>
        )}

        {/* Nút Next */}
        {canScrollNext && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer 
                       bg-white dark:bg-gray-700 p-2 rounded-full shadow z-30"
          >
            <FiChevronRight size={22} />
          </button>
        )}

        {/* Danh sách bạn bè */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {friends.map((friend) => (
            <div
              key={friend.id || friend._id}
              className="flex flex-col justify-between bg-white dark:bg-[#3a3a3a] rounded-lg relative
                         shadow-sm cursor-pointer hover:scale-[0.95] transition w-64 shrink-0 h-96"
            >
              <div
                onClick={() => handleHiddenFriend(friend._id)}
                className="absolute right-3 top-1.5 text-sm text-gray-500 cursor-pointer"
              >
                ✕
              </div>

              <div className="w-full h-64 p-4 overflow-hidden shrink-0">
                <img
                  src={friend.userAvatar || AvatarDefault}
                  alt={friend.userName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex flex-col gap-2">
                <p
                  className="text-lg font-medium truncate dark:text-white"
                  onClick={() => navigate(`/profile/${friend.userName}`)}
                >
                  {friend.lastName} {friend.firstName}
                </p>

                <div className="flex items-center justify-between gap-4">
                  <ButtonComponent
                    text={
                      user.following.includes(friend._id)
                        ? "Bỏ theo dõi"
                        : "Theo dõi"
                    }
                    bgColor={
                      user.following.includes(friend._id)
                        ? "bg-gray-100"
                        : "bg-indigo-500"
                    }
                    textColor={
                      user.following.includes(friend._id)
                        ? "text-black"
                        : "text-white"
                    }
                    hoverColor={
                      user.following.includes(friend._id)
                        ? "hover:bg-gray-200"
                        : "hover:bg-indigo-600"
                    }
                    onClick={() => handleFollowFriend(friend._id)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsSuggestComponent;
