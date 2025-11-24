import React, { useEffect } from "react";
import LogoCTUT from "../../../../assets/logo/logo-ctut.png";
import MediaCarousel from "../MediaCarousel/MediaCarousel";
import FileItem from "../FileItem/FileItem";
import {
  PiFilesLight,
  PiHeartFill,
  PiHeartLight,
  PiImagesSquareLight,
} from "react-icons/pi";
import { VscClose } from "react-icons/vsc";
import * as ValidateToken from "../../../../utils/token.utils";
import * as CommentServices from "../../../../services/user/CommentServices";
import * as HeartServices from "../../../../services/user/HeartServices";
import { useSelector } from "react-redux";
import { formatVietnamTime } from "../../../../utils/formatVietnamTime";
import { useState } from "react";
import { RiMoreLine } from "react-icons/ri";
import ButtonComponent from "../../../../components/shared/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";

const ModalDetailPost = ({
  modalDetailPostId,
  item,
  handleCloseModal,
  commentsList,
}) => {
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCommentForMenu, setSelectedCommentForMenu] = useState(null);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [morePostModal, setMorePostModal] = useState(false);

  const [heartedComments, setHeartedComments] = useState({});
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setComments(commentsList || []);
  }, [commentsList]);

  const handleOpenModalComment = (comment) => {
    setSelectedCommentForMenu(comment);
  };

  const handleCloseModalComment = () => {
    setSelectedCommentForMenu(null);
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);

    const mediaFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (mediaFiles.length !== files.length) {
      alert("Chỉ được chọn ảnh hoặc video!");
    }

    setSelectedMedia((prev) => {
      const newMedia = mediaFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

      const total = prev.length + newMedia.length;
      if (total > 1) {
        const allowed = 1 - prev.length;
        alert(`Chỉ được gửi tối đa 1 media!`);
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

    const maxSize = 10 * 1024 * 1024; // 10MB
    const files = Array.from(e.target.files);

    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      const ext = file.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(ext)) {
        invalidFiles.push(`${file.name} (không hợp lệ)`);
      } else if (file.size > maxSize) {
        invalidFiles.push(`${file.name} (quá lớn >10MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      alert("Các file sau không hợp lệ:\n" + invalidFiles.join("\n"));
    }

    // --- Giới hạn 1 file ---
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
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      const formData = new FormData();
      formData.append("post", item._id);
      formData.append("content", content.trim() || "");

      // Append media and documents with the field names the server expects
      selectedMedia.forEach((m) => formData.append("mediaComments", m.file));
      selectedFiles.forEach((f) => formData.append("documentComments", f));

      const response = await CommentServices.addComment(accessToken, formData);
      console.log("Comment added:", response);

      // Clear inputs & previews on success
      setContent("");
      selectedMedia.forEach((m) => m.url && URL.revokeObjectURL(m.url));
      setSelectedMedia([]);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleHeartComment = async (commentId) => {
    try {
      const token = await ValidateToken.getValidAccessToken();
      const targetType = "Comment";

      const res = await HeartServices.heartTarget(token, commentId, targetType);

      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? {
                ...c,
                heartsCount: res.heartsCount,
                // cập nhật danh sách user đã thả tim
                hearts: res.isHearted
                  ? [...c.hearts, { author: user.id }]
                  : c.hearts.filter((h) => h.author !== user.id),
              }
            : c
        )
      );

      setHeartedComments((prev) => ({
        ...prev,
        [commentId]: res.isHearted,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {modalDetailPostId === item._id && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40">
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-white font-bold cursor-pointer z-50
            text-3xl"
          >
            <VscClose />
          </button>
          <div className="bg-white dark:bg-[#1c1c1d] dark:text-white w-15/18 h-5/6 rounded-lg overflow-hidden relative shadow-lg flex flex-col">
            <div className="flex md:flex-row flex-col overflow-hidden">
              {/* Left Column */}
              <div className="overflow-auto flex-1 p-4 scrollbar-hide">
                {/* Media carousel */}
                {item.medias && item.medias.length > 0 && (
                  <MediaCarousel medias={item.medias} />
                )}
              </div>

              {/* Right Column */}
              <div className="w-120 flex flex-col">
                <div className="flex dark:border-0 border-b border-gray-200 p-2 items-center justify-between">
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

                  {/* Modal */}
                  <div
                    className="cursor-pointer"
                    onClick={() => setMorePostModal(true)}
                  >
                    <RiMoreLine />
                  </div>

                  {morePostModal && (
                    <div className="bg-black/20 inset-0 z-50 flex justify-center items-center fixed">
                      <div className="bg-white rounded-lg flex flex-col gap-2 text-center w-80">
                        <div className="cursor-pointer font-bold text-red-500 border-b border-gray-200 py-1.5">
                          Báo cáo
                        </div>
                        <div className="cursor-pointer font-bold text-red-500 border-b border-gray-200 py-1.5">
                          Bỏ theo dõi Khang
                        </div>
                        <div
                          className="cursor-pointer border-b border-gray-200 py-1.5"
                          onClick={() => navigate(`/post/${item._id}`)}
                        >
                          Đi tới bài viết
                        </div>
                        <div className="cursor-pointer border-b border-gray-200 py-1.5">
                          Chia sẽ lên...
                        </div>

                        <div
                          className="cursor-pointer py-1.5"
                          onClick={() => setMorePostModal(false)}
                        >
                          Hủy
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Khung comment */}
                <div className="flex-1 overflow-auto p-2 space-y-8">
                  {/* Content */}
                  <div className="flex flex-col">
                    <p>{item.content}</p>

                    <div>
                      {item.documents?.map((f, i) => (
                        <div key={i} className="my-3">
                          <FileItem file={f} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* comments */}
                  <div className="space-y-3">
                    {comments && comments.length > 0 ? (
                      comments.map((c) => (
                        <div key={c._id}>
                          <div className="flex gap-3">
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
                              <div className="flex space-x-8 justify-between">
                                <div className="text-sm text-gray-800 mt-1">
                                  {c.content}
                                </div>

                                <div className="mt-2">
                                  <button
                                    onClick={() => handleHeartComment(c._id)}
                                    className="flex items-center gap-2"
                                  >
                                    {heartedComments[c._id] ||
                                    c.hearts.some(
                                      (h) => h.author === user.id
                                    ) ? (
                                      <PiHeartFill className="text-red-500" />
                                    ) : (
                                      <PiHeartLight />
                                    )}

                                    <div className="text-[16px]">
                                      {c.heartsCount}
                                    </div>
                                  </button>
                                </div>
                              </div>

                              {c.medias && c.medias.length > 0 && (
                                <div className="flex gap-2 mt-2">
                                  {c.medias.map((m, i) => (
                                    <div
                                      key={i}
                                      className="w-24 h-16 overflow-hidden rounded"
                                    >
                                      {m.type && m.type.startsWith("image") ? (
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

                              {c.documents && c.documents.length > 0 && (
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

                                {/* modal comment (per-comment) */}
                                {selectedCommentForMenu &&
                                  selectedCommentForMenu._id === c._id && (
                                    <div className="fixed inset-0 bg-black/20 z-50 flex justify-center items-center">
                                      <div className="bg-white p-4 rounded shadow-lg flex flex-col gap-4 w-72">
                                        {String(
                                          selectedCommentForMenu.author?._id ||
                                            selectedCommentForMenu.author
                                        ) === String(user.id) ? (
                                          <>
                                            <div
                                              className="px-3 py-2 text-red-600 font-medium cursor-pointer hover:bg-gray-100 rounded"
                                              onClick={async () => {
                                                const ok = confirm(
                                                  "Xác nhận xóa bình luận?"
                                                );
                                                if (!ok)
                                                  return handleCloseModalComment();
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
                                                        x._id !==
                                                        selectedCommentForMenu._id
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
                                                alert(
                                                  "Đã gửi báo cáo tới quản trị viên"
                                                );
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
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">
                        Chưa có bình luận
                      </div>
                    )}
                  </div>
                </div>

                {/* Previews for selected media / files */}
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
                            title="Xóa media"
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
                              title="Xóa file"
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-auto flex items-center justify-between gap-2 dark:border-0 border-t border-gray-200 py-2 px-4">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalDetailPost;
