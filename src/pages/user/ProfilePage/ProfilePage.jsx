import React, { useState, useEffect, useRef } from "react";
import bgTest from "../../../assets/bgTest/bgTest.jpg";
import logoCTUT from "../../../assets/logo/logo-ctut.png";
import { RiCameraLensFill, RiSettings4Fill } from "react-icons/ri";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import PostCreateComponent from "../../../components/user/PostCreateComponent/PostCreateComponent";
import PostComponent from "../../../components/user/Post/PostComponent/PostComponent";
import * as ValidateToken from "../../../utils/token.utils";
import * as UserServices from "../../../services/user/UserServices";
import * as ChatServices from "../../../services/shared/ChatServices";
import * as AuthServices from "../../../services/shared/AuthServices";
import * as UserServicesShared from "@/services/shared/UserServices";
import * as ReportServices from "@/services/shared/ReportServices";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateFollowingList } from "../../../features/user/userSlice";
import useClickOutside from "../../../hooks/useClickOutside";
import { socket } from "../../../utils/socket";
import MessageBoxComponent from "../../../components/user/MessageBoxComponent/MessageBoxComponent";
import ResourcesComponent from "../../../components/user/ResourcesProfileComponent/ResourcesProfileComponent";
import MessageComponent from "../../../components/shared/MessageComponent/MessageComponent";
import { IoSettingsOutline } from "react-icons/io5";

const ProfilePage = () => {
  const { userName } = useParams();
  const [userDetail, setUserDetail] = useState({});
  const [posts, setPosts] = useState([]);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [coverImage, setCoverImage] = useState(bgTest);
  const [avatarImage, setAvatarImage] = useState(logoCTUT);
  const [loading, setLoading] = useState(false);
  const [followerCount, setFollower] = useState();
  const [userAvatarFile, setUserAvatarFile] = useState(null);
  const [userCoverFile, setUserCoverFile] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingCount, setFollowingCount] = useState(0);
  const [modalFollowList, setModalFollowList] = useState(false);
  const modalFollowListRef = useRef(null);
  const [messageBox, setMessageBox] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [settingModal, setSettingModal] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    type: "",
    key: 1,
  });
  const [reportModal, setReportModal] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  useClickOutside(modalFollowListRef, modalFollowList, () =>
    setModalFollowList(false)
  );
  const [followList, setFollowList] = useState([]);
  const [followType, setFollowType] = useState(""); // "followers" hoặc "following"

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = await ValidateToken.getValidAccessToken();
        const res = await UserServices.getProfile(accessToken, userName);

        setUserDetail(res.data.user);
        setAvatarImage(res.data.user.userAvatar || logoCTUT);
        setCoverImage(res.data.user.userCover || bgTest);
        setPosts(res.data.posts);
        setFollower(res.data.user.followers?.length || 0);
        setFollowingCount(res.data.user.following?.length || 0);

        // Kiểm tra xem người đăng nhập có đang follow user này không
        if (res.data.user.followers?.includes(user.id)) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      } catch (error) {
        if (error.response.data.message === "Không tìm thấy người dùng!") {
          navigate("/404");
        }
        console.log(
          error.response.data.message === "Không tìm thấy người dùng!"
        );
      }
    };

    fetchProfile();
  }, [userName, user.id, navigate]);

  const handleSelectFile = (e, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    setUserAvatarFile(file);
    setUserCoverFile(file);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCancel = (setPreview) => {
    setPreview(null);
  };

  const handleFollowFriend = async (friendId) => {
    setLoading(true);
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const res = await UserServices.followFriend(accessToken, { friendId });

      setIsFollowing(res.isFollowing);

      // Nếu đang xem trang của người khác
      if (userDetail._id !== user.id) {
        setFollower((prev) => prev + (res.isFollowing ? 1 : -1));
      }

      // Nếu đang ở trang cá nhân của chính mình (hoặc modal following)
      if (userDetail._id === user.id) {
        setFollowingCount((prev) => prev + (res.isFollowing ? 1 : -1));

        // Cập nhật danh sách followList trong modal (để đổi nút / ẩn người đó)
        if (followType === "following" && !res.isFollowing) {
          setFollowList((prev) => prev.filter((f) => f._id !== friendId));
        }
      }

      // Cập nhật Redux
      dispatch(updateFollowingList({ friendId, isFollowing: res.isFollowing }));

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModalFollowList = async (type) => {
    setFollowType(type);
    setModalFollowList(true);

    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      let res;

      if (type === "followers") {
        res = await UserServices.getFollower(accessToken, userName);
        setFollowList(res.data.followers || []);
      } else {
        res = await UserServices.getFollowing(accessToken, userName);
        setFollowList(res.data.following || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModalFollowList = () => {
    setModalFollowList(false);
  };

  const handleOpenMessageBox = async (friend) => {
    setMessageBox(true);
    setSelectedUser(friend);

    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      const res = await ChatServices.createChat(accessToken, {
        senderId: friend._id,
      });

      setChatId(res._id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseMessageBox = () => {
    setMessageBox(false);
  };

  const handleLogout = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      await AuthServices.logoutServices(accessToken);

      localStorage.removeItem("accessToken");
      socket.emit("logout", user.id);
      socket.disconnect();

      setMessage({
        text: "Đăng xuất thành công!",
        type: "success",
        key: Date.now(),
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage({
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Đăng xuất thất bại",
        type: "error",
        key: Date.now(),
      });
    }
  };

  // --- Upload avatar ---
  const handleConfirmUserAvatar = async () => {
    if (!userAvatarFile) return;
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const formData = new FormData();
      formData.append("userAvatar", userAvatarFile);

      const res = await UserServicesShared.updateUserAvatar(
        accessToken,
        formData
      );
      if (res.success) {
        setAvatarImage(previewAvatar);
        setUserAvatarFile(null);
        setPreviewAvatar(null);
      }
    } catch (error) {
      console.error(error);
      setPreviewAvatar(null);
    }
  };

  // --- Upload cover ---
  const handleConfirmUserCover = async () => {
    if (!userCoverFile) return;
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const formData = new FormData();
      formData.append("userCover", userCoverFile);

      const res = await UserServicesShared.updateUserCover(
        accessToken,
        formData
      );
      if (res.success) {
        setCoverImage(previewCover);
        setUserCoverFile(null);
        setPreviewCover(null);
      }
    } catch (error) {
      console.error(error);
      setPreviewCover(null);
    }
  };

  const handleOpenReportModal = (user) => {
    setReportModal(user);
  };

  const handleSendReport = async () => {
    setLoading(true);
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      const data = {
        reportType: "User",
        reportModels: reportModal?._id,
        reason: selectedReason,
        reportContent: otherReason,
      };

      const report = await ReportServices.createReport(accessToken, data);

      if (report) {
        setLoading(false);
        setSettingModal(false);
        setReportModal(null);
        setOtherReason("");
        setSelectedReason("");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      setSettingModal(false);
      setReportModal(null);
      setOtherReason("");
      setSelectedReason("");
      console.log("Lỗi", msg);
    }
  };

  return (
    <div className="flex justify-center bg-white dark:bg-[#1c1c1d] dark:text-white">
      {message.text && (
        <MessageComponent
          key={message.key}
          type={message.type}
          message={message.text}
        />
      )}

      <div className="w-full max-w-[940px] p-4">
        {/* Ảnh bìa */}
        <div className="relative">
          <div
            className="relative w-full pb-[35%] bg-cover bg-center rounded-lg overflow-hidden"
            style={{ backgroundImage: `url(${previewCover || coverImage})` }}
          >
            {userDetail._id === user._id && (
              <label className="absolute flex items-center gap-2 right-4 bottom-4 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg cursor-pointer">
                <RiCameraLensFill className="text-lg" />
                <span>Thêm ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleSelectFile(e, setPreviewCover)}
                />
              </label>
            )}

            {previewCover && (
              <div className="absolute flex gap-2 right-4 bottom-4 bg-white p-4 rounded-lg">
                <ButtonComponent
                  text="OK"
                  width="w-28"
                  onClick={handleConfirmUserCover}
                />
                <ButtonComponent
                  text="Hủy"
                  width="w-20"
                  bgColor="bg-gray-200"
                  textColor="text-black"
                  onClick={() => handleCancel(setPreviewCover)}
                />
              </div>
            )}
          </div>

          {/* Avatar + Tên */}
          <div className="absolute -bottom-32 left-8 flex gap-8">
            <div className="relative">
              <div className="w-44 h-44 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white">
                <img
                  className="w-full h-full object-cover"
                  src={previewAvatar || avatarImage}
                  alt="Avatar"
                />
              </div>

              {userDetail._id === user.id && (
                <label className="absolute bottom-1 right-1 p-2 rounded-full dark:bg-gray-700 bg-gray-200 text-2xl cursor-pointer">
                  <RiCameraLensFill />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleSelectFile(e, setPreviewAvatar)}
                  />
                </label>
              )}

              {previewAvatar && (
                <div className="absolute flex items-center gap-2 -bottom-6 -right-44 bg-white shadow p-4 rounded-lg">
                  <ButtonComponent
                    text="OK"
                    width="w-28"
                    onClick={handleConfirmUserAvatar}
                  />
                  <ButtonComponent
                    text="Hủy"
                    bgColor="bg-gray-200"
                    textColor="text-black"
                    width="w-20"
                    onClick={() => handleCancel(setPreviewAvatar)}
                  />
                </div>
              )}

              {/* Nút follow */}
              <div
                className={`absolute -bottom-25 -left-8 ${
                  userDetail._id !== user.id ? "block" : "hidden"
                }`}
              >
                <div className="flex items-center justify-center w-60">
                  {isFollowing ? (
                    <div className="flex flex-col gap-2">
                      <ButtonComponent
                        text="Đang theo dõi"
                        width="w-48"
                        bgColor="bg-gray-100"
                        textColor="text-black"
                        hoverColor="hover:bg-gray-200"
                        py="py-1"
                        disabled={loading}
                        onClick={() => handleFollowFriend(userDetail._id)} // toggle unfollow
                      />

                      <ButtonComponent
                        text="Nhắn tin"
                        py="py-1"
                        onClick={() => handleOpenMessageBox(userDetail)}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <ButtonComponent
                        text="Theo dõi"
                        disabled={loading}
                        onClick={() => handleFollowFriend(userDetail._id)}
                        width="w-40"
                        py="py-1"
                      />

                      <ButtonComponent
                        text="Nhắn tin"
                        py="py-1"
                        onClick={() => handleOpenMessageBox(userDetail)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- Tên, thông tin người dùng --- */}
            <div className="flex flex-col justify-end gap-3">
              <div className=" font-medium flex items-center gap-18">
                <div className="flex items-center gap-2">
                  <div className="text-2xl shrink-0">
                    {userDetail.lastName} {userDetail.firstName}
                  </div>

                  <div className="w-1 h-1 rounded-full bg-gray-400 shrink-0"></div>

                  <div className="text-lg">{userDetail.userName}</div>
                </div>

                <button
                  className={`p-2 text-2xl cursor-pointer `}
                  onClick={() => setSettingModal(true)}
                >
                  <IoSettingsOutline />
                </button>

                {settingModal && (
                  <div className="bg-black/40 fixed inset-0 flex items-center justify-center z-10">
                    <div className="bg-white w-80 rounded-2xl text-center">
                      {user.id === userDetail._id ? (
                        <div>
                          <div
                            onClick={() => navigate("/qr")}
                            className="py-2 border-b border-gray-200 cursor-pointer"
                          >
                            Mã QR
                          </div>
                          <div
                            className="py-2 border-b border-gray-200 cursor-pointer"
                            onClick={() => navigate("/accounts/edit")}
                          >
                            Cài đặt và quyền riêng tư
                          </div>
                          <div
                            className="py-2 border-b border-gray-200 cursor-pointer"
                            onClick={handleLogout}
                          >
                            Đăng xuất
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="py-2 border-b border-gray-200 cursor-pointer text-red-500 font-bold">
                            Chặn
                          </div>

                          <div
                            onClick={() => handleOpenReportModal(userDetail)}
                            className="py-2 border-b border-gray-200 cursor-pointer text-red-500 font-bold"
                          >
                            Báo cáo tài khoản
                          </div>

                          {reportModal && (
                            <div className="fixed inset-0 z-20 bg-black/40 flex items-center justify-center">
                              <div className="bg-white p-4 rounded-lg w-[400px]">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-3">
                                  <div className="font-bold text-lg">
                                    Báo cáo
                                  </div>
                                  <div
                                    onClick={() => setReportModal(null)}
                                    className="cursor-pointer text-xl"
                                  >
                                    ×
                                  </div>
                                </div>

                                {/* Info */}
                                <div className="mb-3">
                                  Đang báo cáo người dùng:{" "}
                                  <b>
                                    {userDetail.lastName} {userDetail.firstName}
                                  </b>
                                </div>

                                {/* Reason select */}
                                <div className="mb-3">
                                  <label className="font-medium">
                                    Lý do báo cáo:
                                  </label>
                                  <select
                                    className="w-full mt-1 border p-2 rounded"
                                    value={selectedReason}
                                    onChange={(e) =>
                                      setSelectedReason(e.target.value)
                                    }
                                  >
                                    <option value="">-- Chọn lý do --</option>
                                    <option
                                      className="cursor-pointer"
                                      value="fake_account"
                                    >
                                      Tài khoản giả mạo
                                    </option>
                                    {!userDetail.isTeacher && (
                                      <>
                                        <option
                                          className="cursor-pointer"
                                          value="spam"
                                        >
                                          Gửi spam hoặc quảng cáo
                                        </option>
                                        <option
                                          className="cursor-pointer"
                                          value="harassment"
                                        >
                                          Quấy rối / bắt nạt
                                        </option>
                                        <option
                                          className="cursor-pointer"
                                          value="hate"
                                        >
                                          Ngôn từ thù địch / công kích cá nhân
                                        </option>
                                        <option
                                          className="cursor-pointer"
                                          value="misinformation"
                                        >
                                          Phát tán thông tin sai sự thật
                                        </option>
                                        <option
                                          className="cursor-pointer"
                                          value="impersonation"
                                        >
                                          Mạo danh người khác
                                        </option>
                                        <option
                                          className="cursor-pointer"
                                          value="scam"
                                        >
                                          Lừa đảo / gây nguy hiểm
                                        </option>
                                        <option value="other">Khác...</option>
                                      </>
                                    )}
                                  </select>
                                </div>

                                {/* Show textarea when reason = other */}
                                {selectedReason === "other" && (
                                  <div className="mb-3">
                                    <label className="font-medium">
                                      Nhập lý do khác:
                                    </label>
                                    <textarea
                                      className="w-full mt-1 border p-2 rounded"
                                      rows="3"
                                      placeholder="Nhập lý do báo cáo..."
                                      value={otherReason}
                                      onChange={(e) =>
                                        setOtherReason(e.target.value)
                                      }
                                    ></textarea>
                                  </div>
                                )}

                                {/* Submit */}
                                <button
                                  className="bg-red-500 text-white px-4 py-2 rounded w-full mt-2"
                                  disabled={loading}
                                  onClick={handleSendReport}
                                >
                                  Gửi báo cáo
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <div
                        className="py-2 cursor-pointer"
                        onClick={() => setSettingModal(false)}
                      >
                        Hủy
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-sm flex gap-4 items-center">
                  <div className="flex items-center gap-1">
                    <div>{posts?.length || 0}</div>
                    <div className="text-gray-500">bài viết</div>
                  </div>
                  <div
                    className="flex items-center gap-1"
                    onClick={() => handleOpenModalFollowList("followers")}
                  >
                    <div>{followerCount || 0}</div>
                    <div className="text-gray-500">người theo dõi</div>
                  </div>
                  <div
                    className="flex items-center gap-1"
                    onClick={() => handleOpenModalFollowList("following")}
                  >
                    <div className="text-gray-500">Đang theo dõi</div>
                    <div>{followingCount || 0}</div>
                    <div className="text-gray-500">người</div>
                  </div>
                </div>

                {/* Modal follower follower */}
                {modalFollowList && (
                  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-10">
                    <div
                      ref={modalFollowListRef}
                      className="bg-white md:w-xl w-96 rounded-lg"
                    >
                      <div className="flex justify-between items-center p-4 border-b">
                        <div className="font-semibold text-lg">
                          {followType === "followers"
                            ? "Người theo dõi"
                            : "Đang theo dõi"}
                        </div>
                        <div
                          className="cursor-pointer text-gray-500 hover:text-red-500"
                          onClick={handleCloseModalFollowList}
                        >
                          ×
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="border px-3 py-1 mb-3 rounded-md">
                          <input
                            className="outline-none w-full"
                            placeholder="Tìm kiếm..."
                            type="text"
                          />
                        </div>

                        <div className="overflow-y-auto border rounded-lg h-96 p-3">
                          {followList.length > 0 ? (
                            followList.map((f) => {
                              // Kiểm tra xem user hiện tại có đang follow người này không
                              const isFollowed = user.following.includes(f._id);

                              return (
                                <div
                                  key={f._id}
                                  className="flex items-center justify-between py-2 border-b last:border-none"
                                >
                                  <div
                                    onClick={() => {
                                      navigate(`/profile/${f.userName}`);
                                      handleCloseModalFollowList();
                                    }}
                                    className="flex items-center gap-3 cursor-pointer"
                                  >
                                    <img
                                      src={f.userAvatar || logoCTUT}
                                      alt={f.userName}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                      <div className="font-medium">
                                        {f.lastName} {f.firstName}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {f.userName}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Nếu là chính mình thì ẩn nút */}
                                  {f._id !== user.id &&
                                    followType === "following" && (
                                      <ButtonComponent
                                        text={
                                          isFollowed
                                            ? "Đang theo dõi"
                                            : "Theo dõi"
                                        }
                                        width="w-32"
                                        bgColor={
                                          isFollowed
                                            ? "bg-gray-100"
                                            : "bg-blue-500"
                                        }
                                        textColor={
                                          isFollowed
                                            ? "text-black"
                                            : "text-white"
                                        }
                                        hoverColor={
                                          isFollowed
                                            ? "hover:bg-gray-200"
                                            : "hover:bg-blue-600"
                                        }
                                        onClick={() =>
                                          handleFollowFriend(f._id)
                                        }
                                      />
                                    )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center text-gray-500 mt-10">
                              Không có người nào.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-sm">
                  {userDetail.bio ? userDetail.bio : "No bio yet"}
                </div>
              </div>

              <div className="relative">
                <div className="flex gap-3 items-center absolute text-[12px]">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                    link 1
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                    link 2
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                    link 3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTENT & SIDEBAR --- */}
        <div className="mt-64 flex w-full gap-6">
          <div className="flex-1 space-y-4">
            <div
              className={`${userDetail._id != user.id ? "hidden" : "block"}`}
            >
              <PostCreateComponent />
            </div>

            <PostComponent postsList={posts} />

            <div className="w-full flex justify-center">
              {posts.length === 0 ? (
                <div className="pt-20">Chưa có bài viết nào.</div>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div
            className={` w-[280px] shrink-0 ${
              posts.length === 0 ? "hidden" : "hidden lg:block"
            }`}
          >
            <ResourcesComponent />
          </div>
        </div>

        {/* Message box */}
        {messageBox ? (
          <MessageBoxComponent
            handleCloseMessageBox={handleCloseMessageBox}
            chatId={chatId}
            selectedUser={selectedUser}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ProfilePage;
