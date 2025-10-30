import React, { useRef, useState, useEffect } from "react";
import ButtonComponent from "../../shared/ButtonComponent/ButtonComponent";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import * as UserServices from "../../../services/user/UserServices";
import * as ValidateToken from "../../../utils/token.utils";
import { useDispatch, useSelector } from "react-redux";
import { updateFollowingList } from "../../../features/user/userSlice";

const FriendsSuggestComponent = ({ friendsSuggest }) => {
  const scrollRef = useRef(null);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const scrollAmount = 270; // bằng 1 card

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

  // 🔁 Kiểm tra trạng thái scroll mỗi khi cuộn
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
    checkScrollPosition(); // chạy lần đầu
    return () => el.removeEventListener("scroll", checkScrollPosition);
  }, []);

  useEffect(() => {
    if (friendsSuggest?.length) {
      // thêm cờ isFollowing = false cho danh sách ban đầu
      setFriends(friendsSuggest.map((f) => ({ ...f, isFollowing: false })));
    }
  }, [friendsSuggest]);

  const handleFollowFriend = async (friendId) => {
    setLoading(true);
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const res = await UserServices.followFriend(accessToken, { friendId });

      const isFollowing = res.isFollowing; // từ BE trả về

      setFriends((prev) => {
        // Cập nhật isFollowing
        const updated = prev.map((f) =>
          f._id === friendId ? { ...f, isFollowing } : f
        );

        // Sắp xếp: người đang follow lên đầu
        updated.sort(
          (a, b) => (b.isFollowing ? 0 : 1) - (a.isFollowing ? 0 : 1)
        );
        return updated;
      });

      // Cập nhật Redux
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

      const data = {
        friendId,
        type: "hidden",
      };

      await UserServices.hiddenOrBlockFriend(accessToken, data);

      setFriends((prev) => prev.filter((f) => f._id !== friendId));
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6 p-4 rounded-xl bg-gray-100 dark:bg-[#2a2a2a] shadow relative">
      <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
        Gợi ý theo dỗi
      </h3>

      {/* Container */}
      <div className="relative">
        {/* Nút Prev */}
        {canScrollPrev && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 
                       bg-white dark:bg-gray-700 p-2 rounded-full shadow z-10"
          >
            <FiChevronLeft size={22} />
          </button>
        )}

        {/* Nút Next */}
        {canScrollNext && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 
                       bg-white dark:bg-gray-700 p-2 rounded-full shadow z-10"
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
              className="flex flex-col justify-between bg-white dark:bg-[#3a3a3a] rounded-lg 
                         shadow-sm cursor-pointer hover:scale-[1.03] transition w-64 shrink-0 h-96"
            >
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={friend.userAvatar || LogoCTUT}
                  alt={friend.userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col gap-6">
                <p className="text-lg font-medium truncate dark:text-white">
                  {friend.lastName} {friend.firstName}
                </p>
                <div className="flex items-center justify-between gap-4">
                  <ButtonComponent
                    text={
                      user.following.includes(friend._id)
                        ? "Bỏ theo dõi"
                        : "Theo dõi"
                    }
                    onClick={() => handleFollowFriend(friend._id)}
                    disabled={loading}
                  />

                  <ButtonComponent
                    text="Ẩn"
                    onClick={() => handleHiddenFriend(friend._id)}
                    disabled={loading}
                    bgColor="bg-white"
                    width="w-40"
                    textColor="text-black"
                    hoverColor="hover:bg-gray-200"
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
