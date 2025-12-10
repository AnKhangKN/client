import React, { useEffect } from "react";
import AvatarDefault from "../../../../assets/logo/avatar_default.webp";
import MediaCarousel from "../MediaCarousel/MediaCarousel";
import FileItem from "../FileItem/FileItem";
import { PiFilesLight, PiImagesSquareLight } from "react-icons/pi";
import { VscClose } from "react-icons/vsc";
import * as ValidateToken from "../../../../utils/token.utils";
import * as CommentServices from "../../../../services/user/CommentServices";
import { useState } from "react";
import { RiMoreLine } from "react-icons/ri";
import ButtonComponent from "../../../../components/shared/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import CommentPost from "./CommentPost/CommentPost";
import * as NotificationServices from "@/services/shared/NotificationServices";

const ModalDetailPost = ({
  modalDetailPostId,
  item,
  handleCloseModal,
  commentsList,
}) => {
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [morePostModal, setMorePostModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [visibleReplies, setVisibleReplies] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setComments(commentsList || []);
  }, [commentsList]);

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

  // --- Handle reply added locally ---
  const handleAddReplyLocally = (parentComment, replyComment) => {
    // 1. Cập nhật repliesCount cho comment cha
    setComments((prev) =>
      prev.map((c) =>
        c._id === parentComment._id
          ? { ...c, repliesCount: (c.repliesCount || 0) + 1 }
          : c
      )
    );

    // 2. Thêm reply mới vào visibleReplies
    setVisibleReplies((prev) => {
      const oldReplies = prev[parentComment._id] || [];
      return { ...prev, [parentComment._id]: [replyComment, ...oldReplies] };
    });
  };

  const handleSendComment = async () => {
    setLoading(true);

    if (
      !content.trim() &&
      selectedMedia.length === 0 &&
      selectedFiles.length === 0
    ) {
      alert("Hãy nhập bình luận hoặc gửi file!");
      setLoading(false);
      return;
    }

    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      const formData = new FormData();
      formData.append("post", item._id);
      formData.append("content", content.trim());

      if (replyingTo) {
        formData.append("parentComment", replyingTo._id);
      }

      selectedMedia.forEach((m) => formData.append("mediaComments", m.file));
      selectedFiles.forEach((f) => formData.append("documentComments", f));

      const response = await CommentServices.addComment(accessToken, formData);

      if (!replyingTo) {
        setComments((prev) => [response, ...prev]);
      }

      if (replyingTo) {
        // Cập nhật local để hiển thị ngay
        handleAddReplyLocally(replyingTo, response);
      }

      const data = {
        user: item.author?._id, // chủ bài viết
        type: "comment",
        post: item?._id,
        message: "đã bình luận bài viết",
      };

      await NotificationServices.createNotification(accessToken, data);

      // reset form
      setContent("");
      setLoading(false);
      setReplyingTo(null);
      setSelectedMedia([]);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error adding comment:", error);
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
          <div
            className={`bg-white dark:bg-[#1c1c1d] dark:text-white ${
              item.medias && item.medias.length > 0 ? "w-15/18" : "w-3/7"
            } 
             h-5/6 rounded-lg overflow-hidden 
          relative shadow-lg flex flex-col`}
          >
            <div className="flex md:flex-row flex-col overflow-hidden h-full">
              {/* Left Column */}
              {item.medias && item.medias.length > 0 && (
                <div className="overflow-auto flex-1 p-4 scrollbar-hide">
                  {/* Media carousel */}
                  {item.medias && item.medias.length > 0 && (
                    <MediaCarousel medias={item.medias} />
                  )}
                </div>
              )}

              {/* Right Column */}
              <div
                className={`${
                  item.medias && item.medias.length > 0 ? "w-140" : "w-full"
                }  flex flex-col`}
              >
                <div className="flex dark:border-0 border-b border-gray-200 items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        src={item.author.userAvatar || AvatarDefault}
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
                <div className="flex-1 overflow-auto p-4 space-y-8">
                  {/* Content */}
                  <div className="flex flex-col">
                    <div
                      className={`${
                        item.bgContent
                          ? `${item.bgContent} flex items-center justify-center py-40 text-4xl text-white`
                          : ""
                      }`}
                    >
                      <p>{item.content}</p>
                    </div>

                    <div>
                      {item.documents?.map((f, i) => (
                        <div key={i} className="my-3">
                          <FileItem file={f} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* comments */}
                  <CommentPost
                    commentList={comments}
                    setReplyingTo={setReplyingTo}
                    visibleReplies={visibleReplies}
                    setVisibleReplies={setVisibleReplies}
                  />
                </div>

                {/* Previews for selected media / files */}
                {(selectedMedia.length > 0 || selectedFiles.length > 0) && (
                  <div className="px-4 py-2">
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
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs
                            cursor-pointer flex items-center justify-center"
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
                <div
                  className="mt-auto flex flex-col justify-between gap-2 dark:border-0 border-t border-gray-200
                 py-2 px-4"
                >
                  {replyingTo && (
                    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded mb-2">
                      <div className="text-sm">
                        Đang trả lời:
                        <span className="font-semibold ml-1">
                          {replyingTo.author?.lastName}{" "}
                          {replyingTo.author?.firstName}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {replyingTo.content}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setReplyingTo(null);
                        }}
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
                    )}
                    <div className="flex gap-2 items-center w-full">
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
                            e.preventDefault(); // tránh xuống dòng
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalDetailPost;
