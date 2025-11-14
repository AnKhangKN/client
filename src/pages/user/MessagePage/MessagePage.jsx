import React, { useEffect, useRef, useState } from "react";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import { BsPencilSquare } from "react-icons/bs";
import { RiSearchLine } from "react-icons/ri";
import { CiCircleInfo } from "react-icons/ci";
import { VscSend } from "react-icons/vsc";
import { PiFilesLight, PiImagesSquareLight } from "react-icons/pi";
import * as ValidateToken from "../../../utils/token.utils";
import * as ChatServices from "../../../services/shared/ChatServices";
import { useSelector } from "react-redux";
import { socket } from "../../../utils/socket";
import SidebarMessageComponent from "../../../components/user/SidebarMessageComponent/SidebarMessageComponent";

const MessagePage = () => {
  const user = useSelector((state) => state.user);
  const userId = user.id;

  const [chatList, setChatList] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const messageEndRef = useRef(null);
  const mediaRefs = useRef({}); // lưu ref cho mỗi media mới

  const listGroup = [
    { id: "1", groupAvatar: LogoCTUT, groupName: "Web" },
    { id: "2", groupAvatar: LogoCTUT, groupName: "Mobile" },
    { id: "3", groupAvatar: LogoCTUT, groupName: "AI" },
  ];

  // --- Fetch chat list ---
  const fetchChatList = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const res = await ChatServices.getChatList(accessToken);
      setChatList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  // --- Select user chat ---
  const handleSelectUser = async (
    userAvatar,
    lastName,
    firstName,
    userName,
    chatId
  ) => {
    setSelectUser({ userAvatar, lastName, firstName, userName, chatId });

    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const res = await ChatServices.getMessageHistory(accessToken, chatId);
      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const chatId = selectUser?.chatId;

  // --- Socket.IO: join room & receive message ---
  useEffect(() => {
    if (!chatId) return;

    socket.emit("joinChat", chatId);

    socket.on("receiveMessage", (msg) => {
      if (msg.chatId === chatId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [chatId]);

  // --- Scroll xuống cuối mỗi khi messages thay đổi ---
  useEffect(() => {
    if (!messages.length) return;
    const lastMessage = messages[messages.length - 1];
    // scroll đến media mới nếu có, ngược lại scroll cuối
    if (lastMessage.medias?.length || lastMessage.documents?.length) {
      const lastMediaKey = `msg-${messages.length - 1}`;
      const el = mediaRefs.current[lastMediaKey];
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

  // --- Handle send message ---
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

      const accessToken = await ValidateToken.getValidAccessToken();
      const res = await ChatServices.sendMessage(accessToken, formData);

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
    <div className="flex h-screen dark:bg-[#1c1c1d] dark:text-white">
      {/* Sidebar */}
      <SidebarMessageComponent
        chatList={chatList}
        user={user}
        handleSelectUser={handleSelectUser}
        listGroup={listGroup}
      />

      {/* Chat area */}
      {selectUser ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-20 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between px-4">
            <div className="flex items-center gap-4 text-lg">
              <div className="bg-white w-12 h-12 rounded-full overflow-hidden">
                <img
                  className="w-full h-full"
                  src={selectUser.userAvatar || LogoCTUT}
                  alt={selectUser.userName}
                />
              </div>
              <div className="flex flex-col">
                <div className="text-sm">
                  {selectUser.lastName} {selectUser.firstName}
                </div>
                <div className="text-[12px] text-gray-500">
                  {selectUser.userName}
                </div>
              </div>
            </div>
            <div className="text-3xl hover:bg-gray-200 p-2 cursor-pointer">
              <CiCircleInfo />
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 flex flex-col md:mb-0 mb-10 overflow-hidden h-screen">
            <div className="overflow-y-auto flex-1 flex flex-col gap-2 p-4">
              {messages.map((msg, idx) => {
                const isMe = (msg.senderId._id || msg.senderId) === userId;
                const prevMsg = messages[idx - 1];
                let showFullTime = false;
                if (!prevMsg) showFullTime = true;
                else {
                  const diff =
                    (new Date(msg.createdAt) - new Date(prevMsg.createdAt)) /
                    (1000 * 60 * 60);
                  if (diff > 1) showFullTime = true;
                }

                const timeDisplay = new Date(msg.createdAt).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" }
                );
                const dateDisplay = new Date(
                  msg.createdAt
                ).toLocaleDateString();
                const mediaKey = `msg-${idx}`;
                return (
                  <React.Fragment key={idx}>
                    {showFullTime && (
                      <div className="text-center text-gray-400 text-xs my-2">
                        {dateDisplay} {timeDisplay}
                      </div>
                    )}

                    <div
                      className={`flex ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-3 py-1.5 rounded-md text-sm max-w-[75%] ${
                          isMe
                            ? "bg-indigo-500 text-white self-end"
                            : "bg-gray-100 dark:bg-[#303030] text-gray-800 self-start"
                        }`}
                        style={{ wordBreak: "break-word" }}
                      >
                        {/* Media */}
                        {msg.medias?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {msg.medias.map((media, i) =>
                              media.type === "image" ? (
                                <img
                                  key={i}
                                  src={media.url}
                                  className="max-w-20 rounded"
                                  ref={(el) =>
                                    (mediaRefs.current[mediaKey] = el)
                                  }
                                />
                              ) : (
                                <video
                                  key={i}
                                  src={media.url}
                                  controls
                                  className="max-w-20 rounded"
                                  ref={(el) =>
                                    (mediaRefs.current[mediaKey] = el)
                                  }
                                  onLoadedData={() =>
                                    mediaRefs.current[mediaKey]?.scrollIntoView(
                                      {
                                        behavior: "smooth",
                                      }
                                    )
                                  }
                                />
                              )
                            )}
                          </div>
                        )}

                        {/* Documents */}
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

                        <div
                          className={
                            msg.documents?.length || msg.medias?.length
                              ? "mt-3"
                              : ""
                          }
                        >
                          {msg.text}
                        </div>

                        {!showFullTime && (
                          <div
                            className={`text-[10px] ${
                              isMe
                                ? "text-gray-200 text-end"
                                : "text-gray-400 text-start"
                            } mt-1`}
                          >
                            {timeDisplay}
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              <div ref={messageEndRef} />
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
                        setSelectedFiles((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-gray-200 p-4 bg-white">
              <div className="flex items-center gap-2">
                <label className="text-green-600 p-1 text-4xl hover:bg-gray-200 rounded-full cursor-pointer">
                  <PiImagesSquareLight />
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleMediaChange}
                  />
                </label>

                <label className="text-indigo-600 p-1 text-4xl hover:bg-gray-200 rounded-full cursor-pointer">
                  <PiFilesLight />
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z"
                    multiple
                    className="hidden"
                    onChange={handleFilesChange}
                  />
                </label>
              </div>

              <div className="flex items-center gap-4 border border-gray-200 w-full rounded-full px-4">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 outline-none text-lg py-2"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div
                  className="text-indigo-600 p-1 text-3xl cursor-pointer hover:text-indigo-800"
                  onClick={handleSendMessage}
                >
                  <VscSend />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex mx-auto items-center text-gray-500">
          Hãy chọn đoạn chat
        </div>
      )}
    </div>
  );
};

export default MessagePage;
