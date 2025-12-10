import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AvatarDefault from "../../../assets/logo/avatar_default.webp";
import * as ValidateToken from "../../../utils/token.utils";
import * as CommentServices from "../../../services/user/CommentServices";
import * as PostServices from "../../../services/user/PostServices";
import * as HeartServices from "@/services/user/HeartServices";
import MediaCarousel from "../../../components/user/Post/MediaCarousel/MediaCarousel";
import FileItem from "../../../components/user/Post/FileItem/FileItem";
import { RiMoreLine } from "react-icons/ri";
import * as NotificationServices from "@/services/shared/NotificationServices";
import {
  PiImagesSquareLight,
  PiFilesLight,
  PiHeartFill,
  PiHeartLight,
  PiChatCenteredDotsLight,
  PiArrowsClockwiseLight,
} from "react-icons/pi";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import TextCollapse from "@/components/user/Post/TextCollapse/TextCollapse";
import CommentPost from "@/components/user/Post/ModalDetailPost/CommentPost/CommentPost";
import ActionPostModal from "@/components/user/Post/PostComponent/ActionPostModal/ActionPostModal";
import { useSelector } from "react-redux";
import SharePostModal from "@/components/user/Post/SharePostModal/SharePostModal";
import { CiLocationArrow1 } from "react-icons/ci";

const PostDetail = () => {
  const { postId } = useParams();
  const user = useSelector((state) => state.user);

  const [postDetails, setPostDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [visibleReplies, setVisibleReplies] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [heartedPost, setHeartedPost] = useState(false);
  const [sharePostModal, setSharePostModal] = useState(null);
  const [showPostMenu, setShowPostMenu] = useState(null);

  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [content, setContent] = useState("");

  // --- Fetch post details ---
  const fetchPostDetails = async () => {
    try {
      const token = await ValidateToken.getValidAccessToken();
      const res = await PostServices.getPostById(token, postId);

      setPostDetails(res.data);
      setHeartedPost(res.data.data.hearts?.some((h) => h.author === user.id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Fetch comments ---
  const fetchComments = async () => {
    try {
      const token = await ValidateToken.getValidAccessToken();
      const res = await CommentServices.getCommentsByPostId(token, postId);
      setComments(res);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchPostDetails();

    fetchComments();
  }, [postId]);

  const handleHeartPost = async () => {
    if (!postDetails) return;
    const accessToken = await ValidateToken.getValidAccessToken();
    const willHeart = !heartedPost;

    setPostDetails((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        heartsCount: willHeart
          ? (prev.data.heartsCount || 0) + 1
          : (prev.data.heartsCount || 0) - 1,
        hearts: willHeart
          ? [...(prev.data.hearts || []), { author: user.id }]
          : (prev.data.hearts || []).filter((h) => h.author !== user.id),
      },
    }));

    setHeartedPost(willHeart);

    try {
      const res = await HeartServices.heartTarget(
        accessToken,
        postDetails.data?._id,
        "Post"
      );

      // Chỉ tạo notification khi bấm tim
      if (willHeart) {
        const data = {
          user: postDetails.data?.author?._id, // chủ bài viết
          sender: user.id, // người hiện tại
          type: "heart",
          post: postDetails.data?._id,
          message: "đã tim bài viết",
        };

        await NotificationServices.createNotification(accessToken, data);
      }

      setPostDetails((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          heartsCount: res.heartsCount,
          hearts: res.isHearted
            ? [...(prev.data.hearts || []), { author: user.id }]
            : (prev.data.hearts || []).filter((h) => h.author !== user.id),
        },
      }));

      setHeartedPost(res.isHearted);
    } catch (err) {
      console.error(err);
      // rollback
      setPostDetails((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          heartsCount: willHeart
            ? (prev.data.heartsCount || 0) + 1
            : (prev.data.heartsCount || 0) - 1,
          hearts: willHeart
            ? [...(prev.data.hearts || []), { author: user.id }]
            : (prev.data.hearts || []).filter((h) => h.author !== user.id),
        },
      }));

      setHeartedPost(!willHeart);
    }
  };

  // --- Share post ---
  const handleOpenSharePostModal = () => setSharePostModal(postDetails);
  const handleCloseSharePostModal = () => setSharePostModal(null);

  // --- Copy link ---
  const handleCopyLink = () => {
    if (!postDetails) return;
    navigator.clipboard
      .writeText(`${window.location.origin}/post/${postDetails._id}`)
      .then(() => alert("Đã sao chép link bài viết!"))
      .catch((err) => console.error("Copy thất bại:", err));
  };

  // --- Comment input ---
  const handleSendComment = async () => {
    if (
      !content.trim() &&
      selectedMedia.length === 0 &&
      selectedFiles.length === 0
    ) {
      alert("Hãy nhập bình luận hoặc gửi file!");
      return;
    }

    setLoading(true);
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const formData = new FormData();
      formData.append("post", postDetails.data._id);
      formData.append("content", content.trim());
      if (replyingTo) formData.append("parentComment", replyingTo._id);
      selectedMedia.forEach((m) => formData.append("mediaComments", m.file));
      selectedFiles.forEach((f) => formData.append("documentComments", f));

      const response = await CommentServices.addComment(accessToken, formData);

      if (!replyingTo) {
        setComments((prev) => [response, ...prev]);
      } else {
        // Cập nhật local replies
        setVisibleReplies((prev) => {
          const oldReplies = prev[replyingTo._id] || [];
          return { ...prev, [replyingTo._id]: [response, ...oldReplies] };
        });
        setComments((prev) =>
          prev.map((c) =>
            c._id === replyingTo._id
              ? { ...c, repliesCount: (c.repliesCount || 0) + 1 }
              : c
          )
        );
      }

      const data = {
        user: postDetails?.data?.author?._id, // chủ bài viết
        sender: user.id, // người gửi hiện tại
        type: "comment",
        post: postDetails?.data?._id,
        message: "đã bình luận bài viết",
      };

      await NotificationServices.createNotification(accessToken, data);

      setContent("");
      setReplyingTo(null);
      setSelectedMedia([]);
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!postDetails) return <div>Loading...</div>;

  return (
    <div className="flex flex-1 h-screen">
      {/* Left column: Post content */}
      <div className="flex-1 mt-20 p-4 border-r border-gray-200 flex flex-col">
        {postDetails.data?.medias?.length > 0 ? (
          <MediaCarousel medias={postDetails.data.medias} />
        ) : (
          <div>
            <div className="text-2xl font-bold">Nội dung bài viết</div>
            <TextCollapse
              text={postDetails.data.content}
              bgColor={postDetails.data.bgContent || ""}
              haveFiles={[
                ...(postDetails.data.medias || []),
                ...(postDetails.data.documents || []),
              ]}
            />
            <div className="mt-4">
              {postDetails.data.documents?.map((f, i) => (
                <div key={i} className="my-3">
                  <FileItem file={f} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right column: Info + comments */}
      <div className="w-120 flex flex-col">
        {/* Author + menu */}
        <div className="border-b border-gray-200 p-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 ">
              <img
                src={postDetails.data.author.userAvatar || AvatarDefault}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              {postDetails.data.author.lastName}{" "}
              {postDetails.data.author.firstName}
            </div>
          </div>
          <button
            onClick={() => setShowPostMenu(postDetails)}
            className="text-xl"
          >
            <RiMoreLine />
          </button>
        </div>

        {/* Comments + actions */}
        <div className="flex-1 p-2 flex flex-col justify-between">
          <div className="space-y-3 overflow-y-auto h-full">
            {postDetails.data.medias?.length > 0 && (
              <div>
                <TextCollapse
                  text={postDetails.data.content}
                  bgColor={postDetails.data.bgContent || ""}
                  haveFiles={[
                    ...(postDetails.data.medias || []),
                    ...(postDetails.data.documents || []),
                  ]}
                />
                <div className="mt-4">
                  {postDetails.data.documents?.map((f, i) => (
                    <div key={i} className="my-3">
                      <FileItem file={f} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showPostMenu && (
              <ActionPostModal
                actionPostModal={showPostMenu}
                handleCloseActionPostModal={() => setShowPostMenu(null)}
              />
            )}

            <div className="flex justify-around items-center text-2xl pt-4 mt-4 border-t border-gray-300 dark:border-0">
              <button
                onClick={handleHeartPost}
                className="flex gap-1.5 items-end cursor-pointer hover:bg-gray-100 py-1.5 pl-2 pr-2.5 rounded-full"
              >
                {heartedPost ? (
                  <PiHeartFill className="text-red-500" />
                ) : (
                  <PiHeartLight />
                )}
                <div className="text-[14px]">
                  {postDetails.data.heartsCount || ""}
                </div>
              </button>

              <button className="flex gap-1.5 items-end cursor-pointer hover:bg-gray-100 py-1.5 pl-2 pr-2.5 rounded-full">
                <PiChatCenteredDotsLight />
                <div className="text-[14px]">
                  {postDetails.data.commentsCount || ""}
                </div>
              </button>

              <button
                onClick={handleOpenSharePostModal}
                className="flex gap-1.5 items-end cursor-pointer hover:bg-gray-100 py-1.5 pl-2 pr-2.5 rounded-full"
              >
                <PiArrowsClockwiseLight />
                <div className="text-[14px]">
                  {postDetails.data.sharesCount || ""}
                </div>
              </button>

              <button
                onClick={handleCopyLink}
                className="cursor-pointer hover:bg-gray-100 py-1.5 pl-1.5 pr-2 rounded-full"
              >
                <CiLocationArrow1 />
              </button>
            </div>

            <div className="h-[calc(100vh-350px)]">
              <CommentPost
                commentList={comments}
                setReplyingTo={setReplyingTo}
                visibleReplies={visibleReplies}
                setVisibleReplies={setVisibleReplies}
              />
            </div>
          </div>

          {/* Media / file preview + input */}
          <div className="relative">
            <div className="absolute -top-16 -left-4">
              {(selectedMedia.length > 0 || selectedFiles.length > 0) && (
                <div className="px-4 pb-2 flex gap-3 items-start">
                  {selectedMedia.map((m, idx) => (
                    <div key={idx} className="relative">
                      {m.file.type.startsWith("image/") ? (
                        <img
                          src={m.url}
                          alt="preview"
                          className="w-32 h-20 object-cover rounded"
                        />
                      ) : (
                        <video
                          src={m.url}
                          className="w-32 h-20 object-cover rounded"
                          controls
                        />
                      )}
                      <button
                        onClick={() =>
                          setSelectedMedia((prev) =>
                            prev.filter((_, i) => i !== idx)
                          )
                        }
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <div className="flex flex-col gap-2">
                    {selectedFiles.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded"
                      >
                        <div className="text-sm">{f.name}</div>
                        <div className="text-xs text-gray-500">
                          {(f.size / 1024).toFixed(1)} KB
                        </div>
                        <button
                          onClick={() =>
                            setSelectedFiles((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="ml-2 text-red-500 text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comment input */}
          <div className="mt-auto flex flex-col justify-between gap-2 border-t border-gray-200 py-2 px-4 relative">
            {replyingTo && (
              <div className="absolute -top-12 left-0 flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded mb-2">
                <div className="text-sm">
                  Đang trả lời:
                  <span className="font-semibold ml-1">
                    {replyingTo.author?.lastName} {replyingTo.author?.firstName}
                  </span>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-red-500 text-lg"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex border border-gray-300 rounded-xl px-2 py-1.5">
              {!content.trim() && (
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="medias"
                    className="cursor-pointer p-1 text-3xl rounded-full text-green-600"
                  >
                    <PiImagesSquareLight />
                  </label>
                  <input
                    id="medias"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const mediaFiles = files.filter(
                        (f) =>
                          f.type.startsWith("image/") ||
                          f.type.startsWith("video/")
                      );
                      setSelectedMedia((prev) => [
                        ...prev,
                        ...mediaFiles.map((file) => ({
                          file,
                          url: URL.createObjectURL(file),
                        })),
                      ]);
                      e.target.value = "";
                    }}
                  />

                  <label
                    htmlFor="files"
                    className="cursor-pointer p-1 text-3xl rounded-full text-indigo-500"
                  >
                    <PiFilesLight />
                  </label>
                  <input
                    id="files"
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setSelectedFiles((prev) => [...prev, ...files]);
                      e.target.value = "";
                    }}
                  />
                </div>
              )}

              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  replyingTo
                    ? `Trả lời ${replyingTo.author?.firstName}...`
                    : "Viết bình luận..."
                }
                className="flex-1 rounded px-2 py-1 outline-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendComment();
                  }
                }}
              />

              <ButtonComponent
                text="Bình luận"
                loading={loading}
                onClick={handleSendComment}
                py="py-2"
                width="w-36"
              />
            </div>
          </div>
        </div>
      </div>

      {sharePostModal && (
        <SharePostModal
          item={sharePostModal}
          handleCloseSharePostModal={handleCloseSharePostModal}
        />
      )}
    </div>
  );
};

export default PostDetail;
