import React, { useState, useEffect } from "react";
import bgTest from "../../../assets/bgTest/bgTest.jpg";
import logoCTUT from "../../../assets/logo/logo-ctut.png";
import { RiCameraLensFill } from "react-icons/ri";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import PostCreateComponent from "../../../components/user/PostCreateComponent/PostCreateComponent";
import PostComponent from "../../../components/user/PostComponent/PostComponent";
import * as ValidateToken from "../../../utils/token.utils";
import * as UserServices from "../../../services/user/UserServices";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateFollowingList } from "../../../features/user/userSlice";

const ProfilePage = () => {
  const { userName } = useParams();
  const [userDetail, setUserDetail] = useState([]);
  const [posts, setPosts] = useState([]);
  const user = useSelector((state) => state.user);

  const [coverImage, setCoverImage] = useState(bgTest);
  const [avatarImage, setAvatarImage] = useState(logoCTUT);
  const [loading, setLoading] = useState(false);
  const [followerCount, setFollower] = useState();

  const [previewCover, setPreviewCover] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = await ValidateToken.getValidAccessToken();
        const res = await UserServices.getProfile(accessToken, userName);

        setUserDetail(res.data.user);
        setPosts(res.data.posts);

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

  useEffect(() => {
    setFollower(userDetail.followers?.length || 0);
  }, [userDetail]);

  useEffect(() => {
    if (userDetail.coverImage) setCoverImage(userDetail.coverImage);
    if (userDetail.avatarImage) setAvatarImage(userDetail.avatarImage);
  }, [userDetail.coverImage, userDetail.avatarImage]);

  const handleSelectFile = (e, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleConfirm = (preview, setMain, setPreview) => {
    if (preview) {
      setMain(preview);
      setPreview(null);
      // TODO: Gửi API cập nhật ảnh server
    }
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
      setFollower((prev) => prev + (res.isFollowing ? 1 : -1));
      dispatch(updateFollowingList({ friendId, isFollowing }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(user);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[940px] p-4">
        {/* Ảnh bìa */}
        <div className="relative">
          <div
            className="relative w-full pb-[35%] bg-cover bg-center rounded-lg overflow-hidden"
            style={{ backgroundImage: `url(${previewCover || coverImage})` }}
          >
            <label className="absolute flex items-center gap-2 right-4 bottom-4 bg-white px-4 py-2 rounded-lg cursor-pointer">
              <RiCameraLensFill className="text-lg" />
              <span>Thêm ảnh</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleSelectFile(e, setPreviewCover)}
              />
            </label>

            {previewCover && (
              <div className="absolute flex gap-2 right-4 bottom-4 bg-white p-4 rounded-lg">
                <ButtonComponent
                  text="OK"
                  width="w-28"
                  onClick={() =>
                    handleConfirm(previewCover, setCoverImage, setPreviewCover)
                  }
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

              <label className="absolute bottom-1 right-1 p-2 rounded-full bg-gray-200 text-2xl cursor-pointer">
                <RiCameraLensFill />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleSelectFile(e, setPreviewAvatar)}
                />
              </label>

              {previewAvatar && (
                <div className="absolute flex items-center gap-2 -bottom-6 -right-44 bg-white shadow p-4 rounded-lg">
                  <ButtonComponent
                    text="OK"
                    width="w-28"
                    onClick={() =>
                      handleConfirm(
                        previewAvatar,
                        setAvatarImage,
                        setPreviewAvatar
                      )
                    }
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
                className={`absolute -bottom-15 -left-8 ${
                  userDetail._id !== user.id ? "block" : "hidden"
                }`}
              >
                <div className="flex items-center justify-center w-60">
                  {isFollowing ? (
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
                  ) : (
                    <ButtonComponent
                      text="Theo dõi"
                      disabled={loading}
                      onClick={() => handleFollowFriend(userDetail._id)}
                      width="w-40"
                      py="py-1"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* --- Tên, thông tin người dùng --- */}
            <div className="flex flex-col justify-end gap-3 text-black">
              <div className=" font-medium flex items-center gap-2">
                <div className="text-2xl shrink-0">
                  {userDetail.lastName} {userDetail.firstName}
                </div>

                <div className="w-1 h-1 rounded-full bg-gray-400 shrink-0"></div>

                <div className="text-lg">{userDetail.userName}</div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-sm flex gap-4 items-center">
                  <div className="flex items-center gap-1">
                    <div>{posts?.length || 0}</div>
                    <div className="text-gray-500">bài viết</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div>{followerCount || 0}</div>
                    <div className="text-gray-500">người theo dõi</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-gray-500">Đang theo dõi</div>
                    <div>{userDetail.following?.length || 0}</div>
                    <div className="text-gray-500">người</div>
                  </div>
                </div>

                <div className="text-sm">
                  {userDetail.bio ? userDetail.bio : "No bio yet"}
                </div>
              </div>

              <div className="relative">
                <div className="flex gap-3 items-center absolute text-[12px]">
                  <div className="bg-gray-100 rounded-full px-3 py-1">
                    link 1
                  </div>
                  <div className="bg-gray-100 rounded-full px-3 py-1">
                    link 2
                  </div>
                  <div className="bg-gray-100 rounded-full px-3 py-1">
                    link 3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTENT & SIDEBAR --- */}
        <div className="mt-56 flex w-full gap-6">
          <div className="flex-1">
            <div
              className={`w-full mb-6 ${
                userDetail._id != user.id ? "hidden" : "block"
              }`}
            >
              <PostCreateComponent />
            </div>

            <div className="w-full">
              <PostComponent postsList={posts} />
            </div>

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
            <div className="sticky top-4">
              <div
                className="h-[650px] flex flex-col gap-4 py-4 border border-gray-200 rounded-lg overflow-y-auto 
              scrollbar-hide shadow"
              >
                <div>
                  <div className="flex items-center justify-between px-4">
                    <div className="font-semibold">Documents</div>
                    <div className="text-blue-500 cursor-pointer">
                      Xem tất cả
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between px-4">
                    <div className="font-semibold">Medias</div>
                    <div className="text-blue-500 cursor-pointer">
                      Xem tất cả
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
