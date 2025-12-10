import React, { useEffect, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosCheckmarkCircle, IoMdLock } from "react-icons/io";
import { BsDashLg } from "react-icons/bs";
import {
  PiArrowsClockwiseLight,
  PiChatCenteredDotsLight,
  PiHeartFill,
  PiHeartLight,
} from "react-icons/pi";
import { CiLocationArrow1 } from "react-icons/ci";
import TextCollapse from "../TextCollapse/TextCollapse";
import MediaLayout from "../MediaLayout/MediaLayout";
import FileItem from "../FileItem/FileItem";
import AvatarDefault from "../../../../assets/logo/avatar_default.webp";
import { formatVietnamTime } from "../../../../utils/formatVietnamTime";
import * as ValidateToken from "../../../../utils/token.utils";
import { useSelector } from "react-redux";
import ModalDetailPost from "../ModalDetailPost/ModalDetailPost";
import * as CommentServices from "../../../../services/user/CommentServices";
import * as HeartServices from "../../../../services/user/HeartServices";
import SharePostModal from "../SharePostModal/SharePostModal";
import { useNavigate } from "react-router-dom";
import { MdNavigateNext } from "react-icons/md";
import { RiMoreLine } from "react-icons/ri";
import ActionPostModal from "./ActionPostModal/ActionPostModal";
import * as NotificationServices from "@/services/shared/NotificationServices";

const PostComponent = ({ postsList }) => {
  const [posts, setPosts] = useState([]);
  const [heartedPosts, setHeartedPosts] = useState({});
  const [modalDetailPostId, setModalDetailPostId] = useState(null);
  const [commentsList, setCommentsList] = useState([]);
  const [sharePostModal, setSharePostModal] = useState(null);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [actionPostModal, setActionPostModal] = useState(null);

  useEffect(() => {
    setPosts(postsList || []);

    const initialHearted = {};
    postsList?.forEach((p) => {
      const postData = p.type === "post" ? p.data : p.data.post;
      initialHearted[p.type === "post" ? p.data._id : p.data._id] =
        postData.hearts?.some((h) => h.author === user.id);
    });
    setHeartedPosts(initialHearted);
  }, [postsList, user.id]);

  const handleHeartPost = async (postId) => {
    const accessToken = await ValidateToken.getValidAccessToken();
    const targetType = "Post";

    const willHeart = !heartedPosts[postId];

    // Tìm bài viết trong state posts
    const postItem = posts.find((p) => {
      const pd = p.type === "post" ? p.data : p.data.post;
      return pd._id === postId;
    });

    if (!postItem) return; // nếu không tìm thấy thì thoát
    const postData =
      postItem.type === "post" ? postItem.data : postItem.data.post;

    // cập nhật state hearts
    setPosts((prev) =>
      prev.map((p) => {
        const pd = p.type === "post" ? p.data : p.data.post;
        if (pd._id !== postId) return p;

        const updatedHeartsCount = willHeart
          ? (pd.heartsCount || 0) + 1
          : (pd.heartsCount || 0) - 1;

        return {
          ...p,
          data:
            p.type === "post"
              ? { ...pd, heartsCount: updatedHeartsCount }
              : { ...p.data, post: { ...pd, heartsCount: updatedHeartsCount } },
        };
      })
    );

    setHeartedPosts((prev) => ({
      ...prev,
      [postId]: willHeart,
    }));

    try {
      const res = await HeartServices.heartTarget(
        accessToken,
        postId,
        targetType
      );

      // Chỉ tạo notification khi bấm tim
      if (willHeart) {
        const data = {
          user: postData.author._id, // chủ bài viết
          type: "heart",
          post: postId,
          message: "đã tim bài viết",
        };

        await NotificationServices.createNotification(accessToken, data);
      }

      // cập nhật hearts thực tế từ server
      setPosts((prev) =>
        prev.map((p) => {
          const pd = p.type === "post" ? p.data : p.data.post;
          if (pd._id !== postId) return p;

          const updatedHearts = res.isHearted
            ? [...(pd.hearts || []), { author: user.id }]
            : (pd.hearts || []).filter((h) => h.author !== user.id);

          return {
            ...p,
            data:
              p.type === "post"
                ? { ...pd, heartsCount: res.heartsCount, hearts: updatedHearts }
                : {
                    ...p.data,
                    post: {
                      ...pd,
                      heartsCount: res.heartsCount,
                      hearts: updatedHearts,
                    },
                  },
          };
        })
      );

      setHeartedPosts((prev) => ({
        ...prev,
        [postId]: res.isHearted,
      }));
    } catch (error) {
      console.log(error);
      // rollback state
      setPosts(posts);
      setHeartedPosts((prev) => ({
        ...prev,
        [postId]: !willHeart,
      }));
    }
  };

  const handleOpenModal = async (postId) => {
    setModalDetailPostId(postId);
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const comments = await CommentServices.getCommentsByPostId(
        accessToken,
        postId
      );
      setCommentsList(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleOpenSharePostModal = (item) => {
    setSharePostModal(item);
    console.log(item);
  };
  const handleCloseSharePostModal = () => setSharePostModal(null);

  const handleCloseActionPostModal = () => setActionPostModal(null);

  return (
    <>
      {posts.map((item) => {
        const isShare = item.type === "share";
        const postData = isShare ? item.data.post : item.data;
        const shareAuthor = isShare ? item.data.author : null; // người share
        const shareCaption = isShare ? item.data.caption : null; // caption người share

        return (
          <div
            key={isShare ? `share-${item.data._id}` : postData._id}
            className="p-4 shadow rounded-md bg-white dark:bg-[#252728] dark:text-white border border-gray-200 dark:border-0 mb-4"
          >
            {/* HEADER */}
            <div className="flex flex-col gap-1">
              {isShare && shareAuthor && (
                <div className="text-sm text-gray-500">
                  <b>
                    {shareAuthor.lastName} {shareAuthor.firstName}
                  </b>{" "}
                  đã chia sẻ
                </div>
              )}

              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {postData.group && (
                      <div className="w-10 h-10 overflow-hidden rounded-sm bg-white">
                        <img
                          className="w-full h-full"
                          src={postData.group.groupAvatar || AvatarDefault}
                          alt="groupAvatar"
                        />
                      </div>
                    )}
                    <div
                      className={`${
                        postData.group
                          ? "absolute top-2 left-2 z-10 border-3 dark:border-black border-white"
                          : ""
                      } w-10 h-10 rounded-full bg-white overflow-hidden`}
                    >
                      <img
                        className="w-full h-full"
                        src={postData.author.userAvatar || AvatarDefault}
                        alt="authorAvatar"
                      />
                    </div>
                  </div>
                  <div className="flex items-start justify-between w-full">
                    <div className="flex flex-col">
                      <div
                        className="font-medium cursor-pointer"
                        onClick={() =>
                          navigate(`/profile/${postData.author.userName}`)
                        }
                      >
                        {postData.author.lastName} {postData.author.firstName}{" "}
                        {postData.author.isTeacher && (
                          <IoIosCheckmarkCircle className="inline text-indigo-500 ml-1" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <div>{formatVietnamTime(postData.createdAt)}</div>
                      </div>
                    </div>

                    <RiMoreLine
                      onClick={() => setActionPostModal(postData)}
                      size={24}
                    />

                    {actionPostModal && (
                      <ActionPostModal
                        actionPostModal={actionPostModal}
                        handleCloseActionPostModal={handleCloseActionPostModal}
                      />
                    )}
                  </div>
                </div>

                {isShare && shareCaption && (
                  <div className="py-4 text-gray-700 dark:text-gray-300 italic">
                    {shareCaption}
                  </div>
                )}
              </div>
            </div>

            {/* NỘI DUNG BÀI GỐC */}
            <div className="mt-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
              <TextCollapse
                text={postData.content}
                bgColor={postData.bgContent || ""}
                haveFiles={[
                  ...(postData.medias || []),
                  ...(postData.documents || []),
                ]}
              />

              {/* FILES */}
              <div className="my-4 flex flex-col gap-2">
                {postData.documents?.map((f, i) => (
                  <FileItem key={i} file={f} />
                ))}
              </div>

              {/* MEDIA */}
              <div
                className="cursor-pointer"
                onClick={() => handleOpenModal(postData._id)}
              >
                <MediaLayout medias={postData.medias} />
              </div>
            </div>

            {/* MODAL DETAIL */}
            <ModalDetailPost
              modalDetailPostId={modalDetailPostId}
              commentsList={commentsList}
              item={postData}
              handleCloseModal={() => setModalDetailPostId(null)}
            />

            {/* ACTIONS */}
            {!isShare ? (
              <div className="flex justify-around items-center text-2xl pt-4 mt-4 border-t border-gray-300 dark:border-0">
                <button
                  className="flex gap-1.5 items-end cursor-pointer hover:bg-gray-100 py-1.5 pl-2 pr-2.5 rounded-full"
                  onClick={() => handleHeartPost(postData._id)}
                >
                  {heartedPosts[postData._id] ? (
                    <PiHeartFill className="text-red-500" />
                  ) : (
                    <PiHeartLight />
                  )}
                  <div className="text-[14px]">
                    {postData.heartsCount !== 0 ? postData.heartsCount : ""}
                  </div>
                </button>

                <button
                  className="flex gap-1.5 items-end cursor-pointer hover:bg-gray-100 py-1.5 pl-2 pr-2.5 rounded-full"
                  onClick={() => handleOpenModal(postData._id)}
                >
                  <PiChatCenteredDotsLight />
                  <div className="text-[14px]">
                    {postData.commentsCount || ""}
                  </div>
                </button>

                <button
                  className="flex gap-1.5 items-end cursor-pointer hover:bg-gray-100 py-1.5 pl-2 pr-2.5 rounded-full"
                  onClick={() => handleOpenSharePostModal(item)}
                >
                  <PiArrowsClockwiseLight />
                  <div className="text-[14px]">
                    {postData.sharesCount || ""}
                  </div>
                </button>

                {sharePostModal && (
                  <SharePostModal
                    item={sharePostModal}
                    handleCloseSharePostModal={handleCloseSharePostModal}
                  />
                )}

                <button
                  onClick={() => {
                    navigator.clipboard
                      .writeText(`http://localhost:5173/post/${postData._id}`)
                      .then(
                        () => {
                          console.log("copy");
                        },
                        (err) => {
                          console.error("Copy thất bại: ", err);
                        }
                      );
                  }}
                  className="cursor-pointer hover:bg-gray-100 py-1.5 pl-1.5 pr-2 rounded-full"
                >
                  <CiLocationArrow1 />
                </button>
              </div>
            ) : (
              <div className="w-full flex justify-center py-4">
                <button
                  className="cursor-pointer flex items-center space-x-4"
                  onClick={() => navigate(`/post/${postData._id}`)}
                >
                  Xem chi tiết bài viết{" "}
                  <span>
                    <MdNavigateNext size={28} />
                  </span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default PostComponent;
