import React, { useEffect, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoMdLock } from "react-icons/io";
import { BsDashLg } from "react-icons/bs";
import {
  PiArrowSquareInLight,
  PiChatCenteredTextLight,
  PiFilesLight,
  PiHeartFill,
  PiHeartLight,
  PiImagesSquareLight,
} from "react-icons/pi";
import { FaUserFriends } from "react-icons/fa";
import { GiEarthAmerica } from "react-icons/gi";

import TextCollapse from "../TextCollapse/TextCollapse";
import MediaLayout from "../MediaLayout/MediaLayout";
import FileItem from "../FileItem/FileItem";
import LogoCTUT from "../../../../assets/logo/logo-ctut.png";
import { formatVietnamTime } from "../../../../utils/formatVietnamTime";
import MediaCarousel from "../MediaCarousel/MediaCarousel";
import * as ValidateToken from "../../../../utils/token.utils";
import * as PostServices from "../../../../services/user/PostServices";
import { useSelector } from "react-redux";

const PostComponent = ({ postsList }) => {
  const [posts, setPosts] = useState(postsList || []);
  const [heartedPosts, setHeartedPosts] = useState({});
  const [modalDetailPostId, setModalDetailPostId] = useState(null);
  const user = useSelector((state) => state.user);

  // Đồng bộ postsList từ parent mà không mất trạng thái heart
  useEffect(() => {
    setPosts((prev) =>
      postsList.map((post) => {
        const oldPost = prev.find((p) => p._id === post._id);
        return { ...post, heart: oldPost?.heart ?? post.heartsCount };
      })
    );
  }, [postsList]);

  const handleHeartPost = async (postId) => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const targetType = "Post";

      // Gọi API heartPost (toggle)
      await PostServices.heartPost(accessToken, { postId, targetType });

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            const isAlreadyHearted =
              heartedPosts[postId] ||
              post.hearts.some((h) => h.author === user.id);

            const newHeartCount = isAlreadyHearted
              ? post.heart - 1
              : post.heart + 1;

            const newHearts = isAlreadyHearted
              ? post.hearts.filter((h) => h.author !== user.id)
              : [...post.hearts, { author: user.id }];

            return { ...post, heart: newHeartCount, hearts: newHearts };
          }
          return post;
        })
      );

      setHeartedPosts((prev) => ({
        ...prev,
        [postId]: !(
          heartedPosts[postId] ||
          posts
            .find((p) => p._id === postId)
            .hearts.some((h) => h.author === user.id)
        ),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModal = (postId) => setModalDetailPostId(postId);
  const handleCloseModal = () => setModalDetailPostId(null);

  return (
    <>
      {posts.map((item) => (
        <div
          key={item._id}
          className="p-4 shadow rounded-md dark:bg-[#252728] border border-gray-200"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                {item.group && (
                  <div className="w-10 h-10 overflow-hidden rounded-sm bg-white">
                    <img
                      className="w-full h-full"
                      src={item.group.groupAvatar}
                      alt="groupAvatar"
                    />
                  </div>
                )}
                <div
                  className={`${
                    item.group?.groupAvatar
                      ? "absolute top-2 left-2 border-3 dark:border-black border-white"
                      : ""
                  } w-10 h-10 rounded-full bg-white overflow-hidden`}
                >
                  <img
                    className="w-full h-full"
                    src={item.author.userAvatar || LogoCTUT}
                    alt="authorAvatar"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col ">
                {item.group ? (
                  <>
                    <div>{item.group.groupName}</div>

                    <div className="group text-sm text-gray-500 flex items-center gap-2 relative">
                      <div>{item.author.firstName}</div>

                      <div className="w-1 h-1 rounded-full bg-gray-600"></div>

                      <div>{formatVietnamTime(item.createdAt)}</div>

                      <div className="w-1 h-1 rounded-full bg-gray-600"></div>

                      <div>
                        {item.privacy === "public" ? (
                          <GiEarthAmerica className="text-gray-600 text-lg" />
                        ) : item.privacy === "friends" ? (
                          <FaUserFriends className="text-gray-600 text-lg" />
                        ) : (
                          <IoMdLock className="text-gray-600 text-lg" />
                        )}
                      </div>

                      <div
                        className="group-hover:block hidden opacity-0 absolute right-6 top-1 bg-gray-600 text-white px-1.5 py-0.5 text-[10px] 
                      rounded-lg"
                      >
                        {item.privacy === "public" ? (
                          <div>Công khai</div>
                        ) : item.privacy === "friends" ? (
                          <div>Bạn bè</div>
                        ) : (
                          <div>Mình tôi</div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-2 items-center">
                      {item.author.lastName} {item.author.firstName}
                    </div>
                    <div className="group text-sm text-gray-500 flex items-center gap-2 relative">
                      <div>{formatVietnamTime(item.createdAt)}</div>
                      <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                      <div>
                        {item.privacy === "public" ? (
                          <GiEarthAmerica className="text-gray-600 text-lg" />
                        ) : item.privacy === "friends" ? (
                          <FaUserFriends className="text-gray-600 text-lg" />
                        ) : (
                          <IoMdLock className="text-gray-600 text-lg" />
                        )}
                      </div>

                      <div
                        className="group-hover:block hidden absolute -right-6 -top-7 bg-gray-600 text-white 
                        px-1.5 py-1 text-[12px] rounded-lg"
                      >
                        {item.privacy === "public" ? (
                          <div>Công khai</div>
                        ) : item.privacy === "friends" ? (
                          <div>Bạn bè</div>
                        ) : (
                          <div>Mình tôi</div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Menu */}
            <div className="flex gap-3 items-center">
              <HiOutlineDotsHorizontal className="w-6 h-6" size={18} />
            </div>
          </div>
          {/* CONTENT */}
          <TextCollapse
            text={item.content}
            bgColor={item.bgContent || ""}
            haveFiles={[...(item.medias || []), ...(item.documents || [])]}
          />
          {/* HASHTAGS */}
          <div className="flex flex-wrap gap-2 mt-2 text-blue-500 text-sm">
            {item.hashtag?.map((tag, i) => (
              <span key={i}>{tag}</span>
            ))}
          </div>
          {/* EMOTION */}
          {item.emotion && (
            <div className="flex items-center gap-1 my-2 text-sm text-gray-600">
              <BsDashLg />
              <span>đang cảm thấy {item.emotion}.</span>
            </div>
          )}
          {/* FILES */}
          <div className="my-4 flex flex-col gap-2">
            {item.documents?.map((f, i) => (
              <FileItem key={i} file={f} />
            ))}
          </div>
          {/* MEDIA */}
          <div
            className="cursor-pointer"
            onClick={() => handleOpenModal(item._id)}
          >
            <MediaLayout medias={item.medias} />
          </div>

          {/* MODAL */}
          {modalDetailPostId === item._id && (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-white dark:text-black text-lg font-bold cursor-pointer z-50"
              >
                X
              </button>
              <div className="bg-white w-15/18 h-5/6 rounded-lg overflow-hidden relative shadow-lg flex flex-col">
                <div className="flex flex-1 overflow-hidden">
                  {/* Left Column */}
                  <div className="flex-1 p-4 border-r border-gray-200 flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">
                      Nội dung bài viết
                    </h2>
                    <div className="overflow-auto flex-1 scrollbar-hide">
                      <p className="mb-4">{item.content}</p>
                      {/* Media carousel */}
                      {item.medias && item.medias.length > 0 && (
                        <MediaCarousel medias={item.medias} />
                      )}
                      <div className="mt-4">
                        {item.documents?.map((f, i) => (
                          <div key={i} className="my-3">
                            <FileItem file={f} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="w-120 flex flex-col">
                    <div className="border-b border-gray-200 p-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            src={item.author.userAvatar || LogoCTUT}
                            alt=""
                          />
                        </div>
                        <div>
                          {item.author.lastName} {item.author.firstName}
                        </div>
                      </div>
                      <div>more</div>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <div className="h-screen">test</div>
                    </div>
                    <div className="mt-auto flex flex-col gap-2 border-t border-gray-200 pt-2 px-4">
                      test
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-200 py-2 px-4">
                      <div className="flex gap-2 items-center">
                        <label
                          htmlFor="medias"
                          className="cursor-pointer p-1 text-3xl rounded-full text-green-600"
                        >
                          <PiImagesSquareLight />
                        </label>
                        <input id="medias" type="file" className="hidden" />
                        <label
                          htmlFor="files"
                          className="cursor-pointer p-1 text-3xl rounded-full text-indigo-500"
                        >
                          <PiFilesLight />
                        </label>
                        <input id="files" type="file" className="hidden" />
                      </div>
                      <div className="flex gap-2 items-center w-full">
                        <input
                          type="text"
                          placeholder="Viết bình luận..."
                          className="flex-1 border border-gray-300 rounded px-2 py-1 outline-0"
                        />
                        <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                          Đăng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* ACTIONS */}
          <div className="flex justify-around items-center text-2xl pt-4 mt-6 border-t border-gray-300 dark:border-0">
            <button
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => handleHeartPost(item._id)}
            >
              {heartedPosts[item._id] ||
              item.hearts.some((h) => h.author === user.id) ? (
                <PiHeartFill className="text-red-500 transition" />
              ) : (
                <PiHeartLight className="transition" />
              )}
              <div className="text-[16px]">{item.heart}</div>
            </button>

            <button
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => handleOpenModal(item._id)}
            >
              <PiChatCenteredTextLight />
              <div className="text-[16px]">{item.comment}</div>
            </button>

            <button className="flex gap-2 items-center cursor-pointer">
              <PiArrowSquareInLight />
              <div className="text-[16px]">{item.share}</div>
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default PostComponent;
