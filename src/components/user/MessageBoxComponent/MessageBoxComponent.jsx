import React, { useState, useRef, useEffect } from "react";
import { PiFilesLight, PiImagesSquareLight } from "react-icons/pi";
import { VscSend } from "react-icons/vsc";
import { IoClose } from "react-icons/io5";
import * as ValidateToken from "../../../utils/token.utils";
import * as ChatServices from "../../../services/shared/ChatServices";
import { socket } from "../../../utils/socket";
import { useSelector } from "react-redux";

const MessageBoxComponent = ({
  handleCloseMessageBox,
  selectedUser,
  chatId,
}) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const user = useSelector((state) => state.user);
  const userId = user.id;

  const messageEndRef = useRef(null);
  const mediaRefs = useRef({});

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- Handle media / file selection ---
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);

    // Lọc chỉ media: ảnh/video
    const mediaFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (mediaFiles.length !== files.length) {
      alert("Chỉ được chọn ảnh hoặc video!");
    }

    // --- Giới hạn 10 media ---
    setSelectedMedia((prev) => {
      const total = prev.length + mediaFiles.length;
      if (total > 10) {
        const allowed = 10 - prev.length;
        alert(
          `Chỉ được gửi tối đa 10 media! Bạn có thể chọn thêm ${allowed} file.`
        );
        return [...prev, ...mediaFiles.slice(0, allowed)];
      }
      return [...prev, ...mediaFiles];
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

    // --- Giới hạn 10 file ---
    setSelectedFiles((prev) => {
      const total = prev.length + validFiles.length;
      if (total > 10) {
        const allowed = 10 - prev.length;
        alert(
          `Chỉ được gửi tối đa 10 file tài liệu! Bạn có thể chọn thêm ${allowed} file.`
        );
        return [...prev, ...validFiles.slice(0, allowed)];
      }
      return [...prev, ...validFiles];
    });

    e.target.value = "";
  };

  // --- Fetch old messages ---
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await ValidateToken.getValidAccessToken();
        const res = await ChatServices.getMessageHistory(token, chatId);
        setMessages(res.data || []);
      } catch (error) {
        console.log("Lỗi khi lấy lịch sử tin nhắn:", error);
      }
    };
    if (chatId) fetchMessages();
  }, [chatId]);

  // --- Join room & receive messages ---
  useEffect(() => {
    if (!chatId) return;
    socket.emit("joinChat", chatId);
    socket.on("receiveMessage", (msg) => {
      if (msg.chatId === chatId) setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("receiveMessage");
  }, [chatId]);

  // --- Scroll xuống cuối hoặc tới media mới ---
  useEffect(() => {
    if (!messages.length) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.medias?.length || lastMessage.documents?.length) {
      const key = `msg-${messages.length - 1}`;
      mediaRefs.current[key]?.scrollIntoView({ behavior: "smooth" });
    } else {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // --- Send message ---
  const handleSendMessage = async () => {
    if (
      !inputValue.trim() &&
      selectedMedia.length === 0 &&
      selectedFiles.length === 0
    )
      return;

    try {
      const formData = new FormData();
      formData.append("chatId", chatId);
      formData.append("text", inputValue.trim() || "");
      selectedMedia.forEach((file) => formData.append("mediaMessages", file));
      selectedFiles.forEach((file) =>
        formData.append("documentMessages", file)
      );

      const token = await ValidateToken.getValidAccessToken();
      const res = await ChatServices.sendMessage(token, formData);

      if (res) {
        setInputValue("");
        setSelectedMedia([]);
        setSelectedFiles([]);
        socket.emit("sendMessage", res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="fixed bottom-12 lg:bottom-0 lg:right-20 right-5 w-96 z-50">
      <div className="bg-white flex flex-col border border-gray-200 lg:shadow-2xl rounded-t-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-3 bg-gray-50">
          <div className="flex gap-2 items-center">
            <div className="h-10 w-10 rounded-full bg-gray-300"></div>
            <div className="flex flex-col">
              <div className="font-semibold text-gray-800">
                {selectedUser?.lastName} {selectedUser?.firstName}
              </div>
              <div className="text-xs text-gray-500">Đang hoạt động</div>
            </div>
          </div>
          <div
            onClick={handleCloseMessageBox}
            className="text-gray-600 hover:text-red-500 cursor-pointer text-xl"
          >
            <IoClose />
          </div>
        </div>

        {/* Message body */}
        <div className="p-3 bg-gray-50 flex-1">
          <div className="overflow-y-auto max-h-96 h-96 flex flex-col gap-2">
            {messages.map((msg, idx) => {
              const isMe = (msg.senderId._id || msg.senderId) === userId;
              const prevMsg = messages[idx - 1];
              let showFullTime =
                !prevMsg ||
                (new Date(msg.createdAt) - new Date(prevMsg.createdAt)) /
                  3600000 >
                  1;
              const timeDisplay = new Date(msg.createdAt).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              );
              const dateDisplay = new Date(msg.createdAt).toLocaleDateString();
              const msgKey = `msg-${idx}`;

              return (
                <React.Fragment key={idx}>
                  {showFullTime && (
                    <div className="text-center text-gray-400 text-xs my-2">
                      {dateDisplay} {timeDisplay}
                    </div>
                  )}
                  <div
                    className={`flex ${
                      isMe ? "justify-end" : "justify-start gap-2"
                    }`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
                    )}
                    <div
                      className={`px-3 py-1.5 rounded-md text-sm max-w-[75%] ${
                        isMe
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-100 dark:bg-[#303030] text-gray-800"
                      }`}
                      style={{ wordBreak: "break-word" }}
                    >
                      {msg.medias?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.medias.map((media, i) =>
                            media.type === "image" ? (
                              <img
                                key={i}
                                src={media.url}
                                className="max-w-20 rounded"
                                ref={(el) => (mediaRefs.current[msgKey] = el)}
                              />
                            ) : (
                              <video
                                key={i}
                                src={media.url}
                                controls
                                className="max-w-20 rounded"
                                ref={(el) => (mediaRefs.current[msgKey] = el)}
                                onLoadedData={() =>
                                  mediaRefs.current[msgKey]?.scrollIntoView({
                                    behavior: "smooth",
                                  })
                                }
                              />
                            )
                          )}
                        </div>
                      )}
                      {msg.documents?.length > 0 && (
                        <div className="mt-2 flex flex-col gap-1">
                          {msg.documents.map((doc, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <PiFilesLight className="text-xl text-gray-600" />
                              <span className="text-sm">{doc.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-4">{msg.text}</div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        </div>

        {/* Preview file */}
        {(selectedMedia.length > 0 || selectedFiles.length > 0) && (
          <div className="p-2 mb-2 flex gap-2 overflow-x-auto">
            {selectedMedia.map((file, idx) => {
              const url = URL.createObjectURL(file);
              return (
                <div
                  key={idx}
                  className="shrink-0 flex flex-col items-center border p-1 gap-1 rounded"
                >
                  {file.type.startsWith("image/") && (
                    <img
                      src={url}
                      alt="preview"
                      className="max-w-20 max-h-20 rounded"
                    />
                  )}
                  {file.type.startsWith("video/") && (
                    <video
                      src={url}
                      controls
                      className="max-w-20 max-h-20 rounded"
                    />
                  )}
                  <button
                    className="text-red-500 text-xs mt-1"
                    onClick={() =>
                      setSelectedMedia((prev) =>
                        prev.filter((_, i) => i !== idx)
                      )
                    }
                  >
                    Xóa
                  </button>
                </div>
              );
            })}

            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="shrink-0 flex flex-col items-center border p-1 gap-1 rounded"
              >
                <PiFilesLight className="text-2xl text-gray-600" />
                <span className="text-sm">{file.name}</span>
                <button
                  className="text-red-500 text-xs mt-1"
                  onClick={() =>
                    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))
                  }
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex items-center justify-between border-t border-gray-200 p-2 bg-white">
          <div className="flex items-center gap-2">
            {/* Media input */}
            <label className="text-green-600 p-1 text-2xl hover:bg-gray-200 rounded-full cursor-pointer">
              <PiImagesSquareLight />
              <input
                ref={imageInputRef}
                className="hidden"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaChange}
              />
            </label>
            {/* File input */}
            <label className="text-indigo-600 p-1 text-2xl hover:bg-gray-200 rounded-full cursor-pointer">
              <PiFilesLight />
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z"
                multiple
                onChange={handleFilesChange}
              />
            </label>
          </div>

          {/* Text input + send */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1 w-64">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 outline-none text-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div
              className="text-indigo-600 p-1 text-xl cursor-pointer hover:text-indigo-800"
              onClick={handleSendMessage}
            >
              <VscSend />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBoxComponent;
