import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import * as ValidateToken from "../../../utils/token.utils";
import * as CommentServices from "../../../services/user/CommentServices";
import * as HeartServices from "../../../services/user/HeartServices";
import * as PostServices from "../../../services/user/PostServices";
import { formatVietnamTime } from "../../../utils/formatVietnamTime";
import MediaCarousel from "../../../components/user/Post/MediaCarousel/MediaCarousel";
import FileItem from "../../../components/user/Post/FileItem/FileItem";
import { RiMoreLine } from "react-icons/ri";
import {
  PiHeartFill,
  PiHeartLight,
  PiImagesSquareLight,
  PiFilesLight,
} from "react-icons/pi";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";

const PostDetail = () => {
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCommentForMenu, setSelectedCommentForMenu] = useState(null);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [heartedComments, setHeartedComments] = useState({});
  const [postDetails, setPostDetails] = useState(null);
  const [showPostMenu, setShowPostMenu] = useState(false);

  const user = useSelector((state) => state.user);
  const { postId } = useParams();
  const navigate = useNavigate();

  // Fetch post details
  const fetchPostDetails = async (postId) => {
    try {
      const token = await ValidateToken.getValidAccessToken();
      const res = await PostServices.getPostById(token, postId);
      setPostDetails(res);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch comments
  const fetchComments = async (postId) => {
    try {
      const token = await ValidateToken.getValidAccessToken();
      const res = await CommentServices.getCommentsByPostId(token, postId);
      setComments(res);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchPostDetails(postId);
    fetchComments(postId);
  }, [postId]);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const mediaFiles = files.filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    if (mediaFiles.length !== files.length)
      alert("Chỉ được chọn ảnh hoặc video!");

    setSelectedMedia((prev) => {
      const newMedia = mediaFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      const total = prev.length + newMedia.length;
      if (total > 1) {
        const allowed = 1 - prev.length;
        alert("Chỉ được gửi tối đa 1 media!");
        return [...prev, ...newMedia.slice(0, allowed)];
      }
      return [...prev, ...newMedia];
    });

    e.target.value = "";
  };

  const handleFilesChange = (e) => {
    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "zip",
      "rar",
      "7z",
    ];
    const maxSize = 10 * 1024 * 1024;
    const files = Array.from(e.target.files);
    const validFiles = [],
      invalidFiles = [];

    files.forEach((f) => {
      const ext = f.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(ext))
        invalidFiles.push(`${f.name} (không hợp lệ)`);
      else if (f.size > maxSize) invalidFiles.push(`${f.name} (quá lớn >10MB)`);
      else validFiles.push(f);
    });

    if (invalidFiles.length)
      alert("Các file không hợp lệ:\n" + invalidFiles.join("\n"));

    setSelectedFiles((prev) => {
      const MAX_FILES = 1;
      const total = prev.length + validFiles.length;
      if (total > MAX_FILES) {
        const allowed = MAX_FILES - prev.length;
        if (allowed <= 0) {
          alert(`Chỉ được gửi tối đa ${MAX_FILES} file tài liệu!`);
          return prev;
        }
        alert(`Chỉ được gửi tối đa ${MAX_FILES} file tài liệu!`);
        return [...prev, ...validFiles.slice(0, allowed)];
      }
      return [...prev, ...validFiles];
    });

    e.target.value = "";
  };

  const handleSendComment = async () => {
    if (!postDetails) return;
    try {
      const token = await ValidateToken.getValidAccessToken();
      const formData = new FormData();
      formData.append("post", postDetails._id);
      formData.append("content", content.trim() || "");
      selectedMedia.forEach((m) => formData.append("mediaComments", m.file));
      selectedFiles.forEach((f) => formData.append("documentComments", f));

      const res = await CommentServices.addComment(token, formData);
      console.log("Comment added:", res);

      // Reset
      setContent("");
      selectedMedia.forEach((m) => m.url && URL.revokeObjectURL(m.url));
      setSelectedMedia([]);
      setSelectedFiles([]);

      // Reload comments
      fetchComments(postDetails._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleHeartComment = async (commentId) => {
    try {
      const token = await ValidateToken.getValidAccessToken();
      const res = await HeartServices.heartTarget(token, commentId, "Comment");

      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? {
                ...c,
                heartsCount: res.heartsCount,
                hearts: res.isHearted
                  ? [...c.hearts, { author: user.id }]
                  : c.hearts.filter((h) => h.author !== user.id),
              }
            : c
        )
      );

      setHeartedComments((prev) => ({ ...prev, [commentId]: res.isHearted }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModalComment = (comment) =>
    setSelectedCommentForMenu(comment);
  const handleCloseModalComment = () => setSelectedCommentForMenu(null);

  if (!postDetails) return <div>Loading...</div>;

  return (
    <div className="flex flex-1 overflow-hidden h-screen">
      {/* Left Column */}
      <div className="flex-1 p-4 border-r border-gray-200 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Nội dung bài viết</h2>
        <div className="overflow-auto flex-1 scrollbar-hide">
          <p className="mb-4">{postDetails.content}</p>
          {postDetails.medias?.length > 0 && (
            <MediaCarousel medias={postDetails.medias} />
          )}
          <div className="mt-4">
            {postDetails.documents?.map((f, i) => (
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
                src={postDetails.author.userAvatar || LogoCTUT}
                alt=""
              />
            </div>
            <div>
              {postDetails.author.lastName} {postDetails.author.firstName}
            </div>
          </div>

          {/* More menu */}
          <button onClick={() => setShowPostMenu(true)} className="text-xl">
            <RiMoreLine />
          </button>
          {showPostMenu && (
            <div className="bg-black/20 inset-0 z-50 flex justify-center items-center fixed">
              <div className="bg-white p-4 rounded shadow-lg flex flex-col gap-2">
                <div
                  className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                  onClick={() => alert("Báo cáo")}
                >
                  Báo cáo
                </div>
                <div
                  className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                  onClick={() => navigate(`/post/${postDetails._id}`)}
                >
                  Đi tới bài viết
                </div>
                <div className="cursor-pointer hover:bg-gray-100 px-2 py-1">
                  Bỏ theo dõi
                </div>
                <div
                  className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                  onClick={() => setShowPostMenu(false)}
                >
                  Hủy
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="flex-1 overflow-auto p-2">
          <div className="space-y-3">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div key={c._id} className="flex gap-3">
                  <div className="w-8 h-8 overflow-hidden rounded-full">
                    <img
                      className="w-full h-full object-cover"
                      src={c.author?.userAvatar || LogoCTUT}
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">
                        {c.author?.lastName ||
                          c.author?.userName ||
                          "Người dùng"}{" "}
                        {c.author?.firstName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatVietnamTime(c.createdAt)}
                      </div>
                    </div>

                    <div className="flex space-x-8 justify-between mt-1">
                      <div className="text-sm text-gray-800">{c.content}</div>
                      <button
                        onClick={() => handleHeartComment(c._id)}
                        className="flex items-center gap-2 mt-2"
                      >
                        {heartedComments[c._id] ||
                        c.hearts.some((h) => h.author === user.id) ? (
                          <PiHeartFill className="text-red-500" />
                        ) : (
                          <PiHeartLight />
                        )}
                        <div className="text-[16px]">{c.heartsCount}</div>
                      </button>
                    </div>

                    {c.medias?.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {c.medias.map((m, i) => (
                          <div
                            key={i}
                            className="w-24 h-16 overflow-hidden rounded"
                          >
                            {m.type?.startsWith("image") ? (
                              <img
                                src={m.url}
                                alt="media"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={m.url}
                                className="w-full h-full object-cover"
                                controls
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {c.documents?.length > 0 && (
                      <div className="mt-2">
                        {c.documents.map((d, i) => (
                          <div key={i} className="my-1">
                            <FileItem file={d} />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-gray-500 flex gap-2 items-center">
                        <div className="cursor-pointer">reply</div>
                        <div
                          onClick={() => handleOpenModalComment(c)}
                          className="hover:bg-gray-100 p-1 rounded-full cursor-pointer"
                        >
                          <RiMoreLine />
                        </div>
                      </div>

                      {selectedCommentForMenu?._id === c._id && (
                        <div className="fixed inset-0 bg-black/20 z-50 flex justify-center items-center">
                          <div className="bg-white p-4 rounded shadow-lg flex flex-col gap-4 w-72">
                            {String(selectedCommentForMenu.author?._id) ===
                            String(user.id) ? (
                              <>
                                <div
                                  className="px-3 py-2 text-red-600 font-medium cursor-pointer hover:bg-gray-100 rounded"
                                  onClick={async () => {
                                    const ok = confirm(
                                      "Xác nhận xóa bình luận?"
                                    );
                                    if (!ok) return handleCloseModalComment();
                                    try {
                                      const token =
                                        await ValidateToken.getValidAccessToken();
                                      await CommentServices.deleteComment(
                                        token,
                                        selectedCommentForMenu._id
                                      );
                                      setComments((prev) =>
                                        prev.filter(
                                          (x) =>
                                            x._id !== selectedCommentForMenu._id
                                        )
                                      );
                                    } catch (err) {
                                      console.error(err);
                                      alert("Xóa thất bại");
                                    } finally {
                                      handleCloseModalComment();
                                    }
                                  }}
                                >
                                  Xóa bình luận
                                </div>
                                <div
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded"
                                  onClick={handleCloseModalComment}
                                >
                                  Hủy
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  className="px-3 py-2 text-red-600 cursor-pointer hover:bg-gray-100 rounded"
                                  onClick={() => {
                                    alert("Đã gửi báo cáo tới quản trị viên");
                                    handleCloseModalComment();
                                  }}
                                >
                                  Báo cáo
                                </div>
                                <div
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded"
                                  onClick={handleCloseModalComment}
                                >
                                  Hủy
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">Chưa có bình luận</div>
            )}
          </div>
        </div>

        {/* Media / File Preview */}
        {(selectedMedia.length > 0 || selectedFiles.length > 0) && (
          <div className="px-4 pb-2">
            <div className="flex gap-3 items-start">
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
          </div>
        )}

        {/* Comment input */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-200 py-2 px-4">
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
              onChange={handleMediaChange}
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
              onChange={handleFilesChange}
            />
          </div>
          <div className="flex gap-2 items-center w-full">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết bình luận..."
              className="flex-1 border border-gray-300 rounded px-2 py-1 outline-0"
            />
            <ButtonComponent
              text="Bình luận"
              onClick={handleSendComment}
              py="py-1"
              width="w-26"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
