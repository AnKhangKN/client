import React, { useEffect, useRef, useState } from "react";
import AvatarDefault from "../../../assets/logo/avatar_default.webp";
import { CiCircleInfo } from "react-icons/ci";
import { VscSend } from "react-icons/vsc";
import {
  PiFilesLight,
  PiHeartFill,
  PiImagesSquareLight,
  PiNotePencilLight,
} from "react-icons/pi";
import { RxDotsHorizontal } from "react-icons/rx";
import * as ValidateToken from "../../../utils/token.utils";
import * as ChatServices from "../../../services/shared/ChatServices";
import * as HeartServices from "@/services/user/HeartServices";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../../utils/socket";
import { SiGitconnected } from "react-icons/si";
import InputComponent from "../../../components/shared/InputComponent/InputComponent";
import SidebarMessageComponent from "../../../components/user/SidebarMessageComponent/SidebarMessageComponent";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import * as UserServices from "../../../services/user/UserServices";
import { IoIosShareAlt } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { updateUser } from "@/features/user/userSlice";

const MessagePage = () => {
  const user = useSelector((state) => state.user);
  const userId = user.id;

  const [chatList, setChatList] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [modalChatDetail, setModalChatDetail] = useState(false);
  const messageEndRef = useRef(null);
  const mediaRefs = useRef({}); // lưu ref cho mỗi media mới
  const [friends, setFriends] = useState([]);
  const [modalNewPassword, setModalNewPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [heartedMessages, setHeartedMessages] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalPasswordPrompt, setModalPasswordPrompt] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [modalEditMessages, setModalEditMessages] = useState(null);
  const [isHidden, setIsHidden] = useState(false);
  const [isHiddenByUserDetail, setIsHiddenByUserDetail] = useState(false);
  const dispatch = useDispatch();

  const [authenticatedChats, setAuthenticatedChats] = useState(() => {
    // Lấy từ sessionStorage
    const saved = sessionStorage.getItem("authenticatedChats");
    return saved ? JSON.parse(saved) : {};
  });

  const navigate = useNavigate();

  const [userSelectedCheckHidden, setUserSelectedCheckHidden] = useState({});
  const [cancelPassword, setCancelPassword] = useState(false);

  const fetchFriends = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      const res = await UserServices.getFriends(accessToken);

      setFriends(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChatList = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const res = await ChatServices.getAllChatList(accessToken);
      setChatList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchChatList();
  }, []);

  useEffect(() => {
    if (!selectUser) return;

    setIsHidden(
      user.friendsHidden?.some(
        (item) => String(item.friendId?._id) === String(selectUser._id)
      )
    );

    setIsHiddenByUserDetail(
      userSelectedCheckHidden.friendsHidden?.some(
        (item) => String(item.friendId) === String(user._id)
      )
    );
  }, [selectUser, userSelectedCheckHidden]);

  const handleSelectUser = async (
    _id,
    userAvatar,
    lastName,
    firstName,
    userName,
    chatId,
    chatName,
    members,
    admins
  ) => {
    const selected = {
      _id,
      userAvatar,
      lastName,
      firstName,
      userName,
      chatId,
      chatName,
      members,
      admins,
    };
    setSelectUser(selected);

    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const res = await ChatServices.getChatPassword(accessToken, chatId);

      setHasPassword(res.hasPassword);

      await checkHidden(userName);

      if (res.hasPassword && !authenticatedChats[chatId]) {
        setModalPasswordPrompt(true);
      } else {
        await loadMessages(chatId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkHidden = async (userName) => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const res = await UserServices.getProfile(accessToken, userName);

      const selectedUserData = res.data.user;
      setUserSelectedCheckHidden(selectedUserData);

      // Cập nhật check hidden ngay
      setIsHidden(
        user.friendsHidden?.some(
          (item) => String(item.friendId?._id) === String(selectedUserData._id)
        )
      );

      setIsHiddenByUserDetail(
        selectedUserData.friendsHidden?.some(
          (item) => String(item.friendId) === String(user._id)
        )
      );
    } catch (error) {
      if (error.response.data.message === "Không tìm thấy người dùng!") {
        navigate("/404");
      }
      console.log(error.response.data.message === "Không tìm thấy người dùng!");
    }
  };

  const handleUnblock = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      const id = selectUser._id;

      const res = await UserServices.deleteUserHidden(accessToken, id);

      if (res) {
        setModalChatDetail(false);
        dispatch(updateUser(res.data));
        setSelectUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmPassword = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const res = await ChatServices.verifyChatPassword(accessToken, {
        chatId: selectUser.chatId,
        password: enteredPassword,
      });

      if (res) {
        // Lưu vào session
        const updated = {
          ...authenticatedChats,
          [selectUser.chatId]: true,
        };
        setAuthenticatedChats(updated);
        sessionStorage.setItem("authenticatedChats", JSON.stringify(updated));

        setModalPasswordPrompt(false);
        setEnteredPassword("");
        await loadMessages(selectUser.chatId);
      } else {
        alert("Mật khẩu không đúng!");
      }
    } catch (error) {
      console.log(error);
      alert("Lỗi xác thực mật khẩu!");
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const res = await ChatServices.getMessageHistory(accessToken, chatId);
      setMessages(res.data);

      const initialHearted = {};
      res.data.forEach((msg) => {
        initialHearted[msg._id] =
          msg.hearts?.some((h) => h.author === userId) || false;
      });
      setHeartedMessages(initialHearted);
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

    socket.on("messageDeleted", (messageId) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, text: "Tin nhắn đã bị xóa", medias: [], documents: [] }
            : msg
        )
      );
    });

    return () => {
      socket.off("receiveMessage"), socket.off("messageDeleted");
    };
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

      if (replyingTo) {
        formData.append("parentMessage", replyingTo._id);
        formData.append("parentText", replyingTo.text);
      }

      selectedMedia.forEach((file) => formData.append("mediaMessages", file));
      selectedFiles.forEach((file) =>
        formData.append("documentMessages", file)
      );

      const accessToken = await ValidateToken.getValidAccessToken();
      const res = await ChatServices.sendMessage(accessToken, formData);

      if (res) {
        setInputValue("");
        setReplyingTo(null);
        setSelectedMedia([]);
        setSelectedFiles([]);
        socket.emit("sendMessage", res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      const res = await ChatServices.deleteMessage(accessToken, messageId);

      if (res) {
        setModalEditMessages(null);

        // Chỉ cập nhật UI: đổi text thành "Tin nhắn đã bị xóa"
        setMessages((prev) =>
          prev.map((m) =>
            m._id === messageId
              ? {
                  ...m,
                  text: "Tin nhắn đã bị xóa",
                  medias: [],
                  documents: [],
                }
              : m
          )
        );

        // Emit socket nếu muốn đồng bộ với người khác
        socket.emit("deleteMessage", { _id: messageId, chatId });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const handleOpenModalChatDetail = () => {
    setModalChatDetail(true);
  };

  const handleCloseModalChatDetail = () => {
    setModalChatDetail(false);
  };

  const handleHeartMessage = async (messageId) => {
    console.log(messageId);

    const accessToken = await ValidateToken.getValidAccessToken();
    const targetType = "Message";

    const willHeart = !heartedMessages[messageId];

    // Cập nhật UI tạm thời
    setMessages((prev) =>
      prev.map((m) =>
        m._id === messageId
          ? {
              ...m,
              heartsCount: willHeart ? m.heartsCount + 1 : m.heartsCount - 1,
              hearts: willHeart
                ? [...m.hearts, { author: user.id }]
                : m.hearts.filter((h) => h.author !== user.id),
            }
          : m
      )
    );

    setHeartedMessages((prev) => ({
      ...prev,
      [messageId]: willHeart,
    }));

    try {
      const res = await HeartServices.heartTarget(
        accessToken,
        messageId,
        targetType
      );

      // Đồng bộ lại với server
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? {
                ...m,
                heartsCount: res.heartsCount,
                hearts: res.isHearted
                  ? [...m.hearts, { author: user.id }]
                  : m.hearts.filter((h) => h.author !== user.id),
              }
            : m
        )
      );

      setHeartedMessages((prev) => ({
        ...prev,
        [messageId]: res.isHearted,
      }));
    } catch (error) {
      console.log(error);
      // Nếu lỗi, rollback UI
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? {
                ...m,
                heartsCount: willHeart ? m.heartsCount - 1 : m.heartsCount + 1,
                hearts: willHeart
                  ? m.hearts.filter((h) => h.author !== user.id)
                  : [...m.hearts, { author: user.id }],
              }
            : m
        )
      );
      setHeartedMessages((prev) => ({
        ...prev,
        [messageId]: !willHeart,
      }));
    }
  };

  const handleAddPassword = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      const data = { chatId, newPassword, confirmPassword };

      const res = await ChatServices.addNewPasswordChat(accessToken, data);

      if (res) {
        alert("Đã cập nhật mật khẩu mới thành công!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModalEditMessages = (message) => {
    setModalEditMessages((prev) =>
      prev && prev._id === message._id ? null : message
    );
  };

  const handleBlockFriend = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const res = await UserServices.hiddenOrBlockFriend(accessToken, {
        friendId: selectUser._id,
        type: "block",
      });

      if (res) {
        alert("Chặn người dùng thành công!");
        setSelectUser(null);
        handleCloseModalChatDetail();
        dispatch(updateUser(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen dark:bg-[#1c1c1d] dark:text-white">
      {/* Sidebar */}
      <SidebarMessageComponent
        chatList={chatList}
        friends={friends}
        user={user}
        handleSelectUser={handleSelectUser}
      />

      {/* Chat area */}
      {selectUser ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-20 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between px-4">
            <div className="flex items-center gap-4 text-lg">
              <div className="text-sm">{selectUser.chatName}</div>
            </div>
            {isHiddenByUserDetail ? (
              <></>
            ) : isHidden ? (
              <></>
            ) : (
              <div
                onClick={handleOpenModalChatDetail}
                className="text-3xl hover:bg-gray-200 p-2 cursor-pointer"
              >
                <CiCircleInfo />
              </div>
            )}
          </div>

          {/* modal detail */}
          {modalChatDetail && (
            <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
              <div className="bg-white dark:bg-[#1f1f1f] lg:w-1/2 md:w-2/3 w-full overflow-hidden">
                {/* Header */}
                <div
                  className="flex justify-between items-center h-20 border-b border-gray-200 
                dark:border-gray-700 px-6"
                >
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {selectUser.groupName || "Chi tiết chat"}
                  </h2>
                  <button
                    onClick={handleCloseModalChatDetail}
                    className="text-gray-500 hover:text-red-500 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Content */}
                <div
                  className={`p-6 flex flex-col  ${
                    selectUser?.members?.length <= 2
                      ? "justify-between"
                      : "gap-6"
                  }  md:h-[620px] h-[calc(100vh-110px)] overflow-y-auto`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="pr-4 py-3 border-r border-gray-200">
                        Mật khẩu
                      </span>
                      <span className="pl-4">• • • • • • • • • •</span>
                    </div>

                    <button
                      onClick={() => setModalNewPassword(true)}
                      className="text-2xl hover:bg-gray-200 p-2 rounded-full transition"
                    >
                      <PiNotePencilLight />
                    </button>
                  </div>

                  {/* Cài đặt mật khẩu */}
                  <div className="p-4 bg-gray-50 dark:bg-[#2a2a2a]">
                    {modalNewPassword && (
                      <div className="fixed inset-0 z-10 bg-black/40 flex justify-center items-center">
                        <div className="bg-white p-4 rounded-lg flex flex-col space-y-4">
                          <div className="flex items-center justify-between">
                            <div>Mật khẩu đoạn chat</div>
                            <button
                              className="cursor-pointer"
                              onClick={() => {
                                setModalNewPassword(false);
                                setIsForgotPassword(false);
                              }}
                            >
                              x
                            </button>
                          </div>

                          <div className="flex flex-col space-y-3">
                            {hasPassword ? (
                              <div className="flex flex-col space-y-3">
                                <InputComponent label="Mật khẩu cũ" />

                                <InputComponent label="Mật khẩu mới" />

                                <InputComponent label="Xác nhận mật khẩu" />
                              </div>
                            ) : (
                              <div className="flex flex-col space-y-3">
                                <InputComponent
                                  label="Mật khẩu mới"
                                  value={newPassword}
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                  placeholder="Hãy nhập mật khẩu mới"
                                />

                                <InputComponent
                                  label="Xác nhận mật khẩu"
                                  value={confirmPassword}
                                  onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                  }
                                  placeholder="Hãy nhập lại xác nhận mật khẩu"
                                />
                              </div>
                            )}

                            <div className="flex justify-between items-center space-x-4">
                              {hasPassword && (
                                <>
                                  <ButtonComponent
                                    text="Bỏ mật khẩu"
                                    width="w-60"
                                    bgColor="bg-white"
                                    hoverColor="hover:bg-gray-200"
                                    textColor="text-black"
                                    onClick={() => {
                                      setCancelPassword(true);
                                    }}
                                  />

                                  {cancelPassword && (
                                    <div className="fixed z-10 bg-black/40 inset-0 flex items-center justify-center">
                                      <div className="bg-white p-4 rounded-lg flex flex-col space-y-4">
                                        <div className="flex items-center justify-between">
                                          <div>Bỏ mật khẩu</div>
                                          <div
                                            onClick={() =>
                                              setCancelPassword(false)
                                            }
                                          >
                                            close
                                          </div>
                                        </div>

                                        <div className="flex flex-col space-y-4">
                                          <InputComponent label="Nhập lại mật khẩu" />

                                          <ButtonComponent text="Xác định xóa mật khẩu" />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}

                              {hasPassword ? (
                                <ButtonComponent text="Cập nhật" />
                              ) : (
                                <ButtonComponent
                                  text="Thêm mới"
                                  onClick={handleAddPassword}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chỉ hiển thị với group */}
                  {selectUser?.members?.length > 2 ? (
                    <>
                      {/* Tên nhóm mới */}
                      <div className="p-4 bg-gray-50 dark:bg-[#2a2a2a] flex flex-col gap-4">
                        <h3 className="font-medium text-gray-700 dark:text-gray-200">
                          Chỉnh sửa nhóm
                        </h3>
                        <div className="flex gap-4 items-center">
                          <InputComponent
                            label="Tên nhóm mới"
                            value=""
                            placeholder="Nhập tên nhóm..."
                          />
                          <ButtonComponent text="Cập nhật" width="w-36" />
                        </div>

                        {/* Danh sách thành viên */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                              Danh sách thành viên
                            </span>
                            <ButtonComponent
                              text="Thêm thành viên"
                              width="w-36"
                            />
                          </div>
                          <div className="overflow-y-auto max-h-60 flex flex-col gap-3 p-2">
                            {selectUser.members.map((member) => (
                              <div
                                className="flex items-center justify-between p-2 hover:bg-gray-200 dark:hover:bg-[#3a3a3a] 
                                rounded-lg"
                                key={member._id}
                              >
                                <div className="flex items-center gap-3 justify-between">
                                  <div className="w-10 h-10 rounded-full overflow-hidden">
                                    <img
                                      className="w-full h-full object-cover"
                                      src={member.userAvatar || AvatarDefault}
                                      alt={`${member.firstName} ${member.lastName}`}
                                    />
                                  </div>
                                  <div className="flex flex-col text-gray-800 dark:text-gray-100 font-medium">
                                    <div>
                                      {member.lastName} {member.firstName}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      {/* Hiển thị badge nếu member là admin */}
                                      {selectUser.admins?.some(
                                        (admin) => admin._id === member._id
                                      ) && (
                                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
                                          Quản trị viên
                                        </span>
                                      )}

                                      {/* Username */}
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {member.userName}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {member._id !== userId && <div>more</div>}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Hành động */}
                        <div className="flex justify-end gap-4 mt-4">
                          <ButtonComponent text="Rời khỏi nhóm" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-4 mt-4">
                        <ButtonComponent
                          text="Chặn người dùng"
                          onClick={handleBlockFriend}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {modalPasswordPrompt && (
            <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg w-96 flex flex-col space-y-4">
                <h2 className="text-lg font-semibold mb-4">
                  Nhập mật khẩu chat
                </h2>

                {isForgotPassword ? (
                  <div className="flex flex-col space-y-4">
                    <InputComponent
                      type="password"
                      label="Mật khẩu tài khoản"
                    />
                    <InputComponent type="password" label="Mật khẩu mới" />
                    <InputComponent type="password" label="Nhập lại mật khẩu" />
                  </div>
                ) : (
                  <InputComponent
                    type="password"
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    label="Mật khẩu"
                    placeholder="Nhập mật khẩu đoạn chat"
                  />
                )}

                {hasPassword && (
                  <div
                    className="text-end cursor-pointer"
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Quên mật khẩu?
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <ButtonComponent
                    text="Hủy"
                    textColor="black"
                    bgColor="bg-white"
                    hoverColor="hover:bg-gray-200"
                    onClick={() => {
                      setModalPasswordPrompt(false),
                        setSelectUser(null),
                        setIsForgotPassword(false);
                    }}
                  />
                  <ButtonComponent
                    text="Xác nhận"
                    onClick={handleConfirmPassword}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Chat messages */}
          <div className="flex-1 flex flex-col md:mb-0 mb-10 overflow-hidden h-screen">
            <div className="overflow-y-auto flex-1 flex flex-col gap-2 p-4">
              {messages.map((msg, idx) => {
                const isMe = (msg.senderId._id || msg.senderId) === userId;
                const prevMsg = messages[idx - 1];

                // --- Xác định có nên hiển thị full time/date ---
                let showFullTime = false;
                if (!prevMsg) showFullTime = true;
                else {
                  const diff =
                    (new Date(msg.createdAt) - new Date(prevMsg.createdAt)) /
                    (1000 * 60 * 60);
                  if (diff > 1) showFullTime = true;
                }

                // --- Xác định có nên hiển thị tên người gửi ---
                let showSenderName = false;
                if (!isMe) {
                  if (!prevMsg) {
                    showSenderName = true;
                  } else {
                    const sameSender =
                      (prevMsg.senderId._id || prevMsg.senderId) ===
                      (msg.senderId._id || msg.senderId);
                    const diff =
                      (new Date(msg.createdAt) - new Date(prevMsg.createdAt)) /
                      (1000 * 60 * 60);
                    if (!sameSender || diff > 1) showSenderName = true;
                  }
                }

                const timeDisplay = new Date(msg.createdAt).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
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
                      className={`flex relative ${
                        isMe ? "justify-end" : "justify-start"
                      } gap-4`}
                    >
                      {/* Avatar chỉ hiển thị nếu không phải mình và nếu là đầu nhóm */}
                      {!isMe && showSenderName && (
                        <div className="w-8 h-8 absolute rounded-full overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            src={msg.senderId.userAvatar || AvatarDefault}
                            alt={msg.senderId.userName}
                          />
                        </div>
                      )}

                      <div
                        className={`pb-1.5 ml-10 text-sm max-w-[70%] rounded-md relative group ${
                          isMe
                            ? "bg-indigo-500 text-white"
                            : "bg-gray-100 dark:bg-[#303030] text-gray-800"
                        }`}
                        style={{ wordBreak: "break-word" }}
                      >
                        {(msg.parentMessage?.text || msg.parentText) && (
                          <div
                            className={`z-10 py-1.5 rounded-t-lg px-2 ${
                              isMe ? "bg-indigo-700" : "bg-gray-400"
                            }`}
                          >
                            <span>Đã trả lời: </span>
                            <span>
                              {msg.parentMessage?.text || msg.parentText}
                            </span>
                          </div>
                        )}

                        {msg.text && (
                          <div className="px-2 py-1.5">{msg.text}</div>
                        )}

                        {/* Media: luôn hiển thị dưới cùng */}
                        {msg.medias?.length > 0 && (
                          <div className="mt-2 px-2 py-1.5 flex flex-wrap gap-2">
                            {msg.medias.map((media, i) =>
                              media.type === "image" ? (
                                <img
                                  key={i}
                                  src={media.url}
                                  className="max-w-20"
                                  ref={(el) =>
                                    (mediaRefs.current[mediaKey] = el)
                                  }
                                />
                              ) : (
                                <video
                                  key={i}
                                  src={media.url}
                                  controls
                                  className="max-w-20"
                                  ref={(el) =>
                                    (mediaRefs.current[mediaKey] = el)
                                  }
                                />
                              )
                            )}
                          </div>
                        )}

                        {/* Documents */}
                        {msg.documents?.length > 0 && (
                          <div className="mt-2 px-2 py-1.5 flex flex-col gap-1">
                            {msg.documents.map((doc, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <PiFilesLight className="text-xl text-gray-600" />
                                <span className="text-sm">{doc.name}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div
                          className={`absolute -bottom-1  px-1 rounded-full ${
                            isMe
                              ? "-left-7 bg-indigo-400"
                              : "-right-7 bg-gray-200"
                          } flex items-center gap-1`}
                        >
                          {heartedMessages[msg._id] ? (
                            <PiHeartFill className="text-red-500" />
                          ) : msg.heartsCount > 0 ? (
                            <PiHeartFill className="text-gray-400" />
                          ) : null}

                          {msg.heartsCount > 0 && <div>{msg.heartsCount}</div>}
                        </div>

                        <div className="flex px-2 pb-1.5 gap-1 items-center mt-1">
                          {/* Thời gian */}
                          {!showFullTime && (
                            <div
                              className={`text-[10px] shrink-0 ${
                                isMe
                                  ? "text-gray-200 text-end"
                                  : "text-gray-400 text-start"
                              } `}
                            >
                              {timeDisplay}
                            </div>
                          )}

                          {!isMe && showSenderName && (
                            <div className="text-[10px] shrink-0 flex gap-2 items-center text-gray-400">
                              <div className="mb-0.5">
                                <SiGitconnected size={14} />
                              </div>

                              <div className="shrink-0">
                                {msg.senderId.lastName}
                                {msg.senderId.firstName}
                              </div>
                            </div>
                          )}
                        </div>

                        <div
                          className={`absolute ${
                            modalEditMessages?._id === msg._id
                              ? "flex"
                              : "hidden group-hover:flex"
                          } px-4 py-1 top-1/3 ${
                            isMe ? "-left-28" : "-right-28"
                          } text-lg text-gray-600 items-center space-x-1`}
                        >
                          <div
                            className="hover:bg-gray-100 p-1 rounded-full cursor-pointer"
                            onClick={() => handleHeartMessage(msg._id)}
                          >
                            {heartedMessages[msg._id] ? (
                              <PiHeartFill className="text-red-500" />
                            ) : (
                              <PiHeartFill />
                            )}
                          </div>

                          <div
                            onClick={() => setReplyingTo(msg)}
                            className="hover:bg-gray-100 p-1 rounded-full cursor-pointer"
                          >
                            <IoIosShareAlt />
                          </div>

                          <div className="hover:bg-gray-100 p-1 rounded-full cursor-pointer relative">
                            <RxDotsHorizontal
                              onClick={() => handleOpenModalEditMessages(msg)}
                            />

                            {modalEditMessages?._id === msg._id && (
                              <div className="absolute z-10 bg-white text-[12px] w-20 right-0 px-2 py-1">
                                <div className="cursor-pointer">Chỉnh sửa</div>
                                <div
                                  onClick={() => handleDeleteMessage(msg._id)}
                                  className="cursor-pointer"
                                >
                                  Xóa
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
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
            <div className="flex flex-col gap-2 border-t border-gray-200 p-4 bg-white">
              {replyingTo && (
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded mb-2">
                  <div className="text-sm">
                    Đang trả lời:
                    <span className="ml-1">
                      {replyingTo.senderId.lastName || "Chính mình"}
                      {replyingTo.senderId.firstName}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {replyingTo.text}
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

              {isHidden ? (
                <div>
                  <ButtonComponent
                    text="Bỏ chặn để chat"
                    onClick={handleUnblock}
                  />
                </div>
              ) : isHiddenByUserDetail ? (
                <div>Hiện không thể gửi tin nhắn</div>
              ) : (
                <div className="flex items-center gap-2">
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
              )}
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
