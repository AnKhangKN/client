import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import { ImImages } from "react-icons/im";
import {
  BsEmojiLaughing,
  BsFileEarmarkCheckFill,
  BsTagsFill,
} from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import { IoMdLock } from "react-icons/io";
import { FaPalette, FaTimesCircle, FaUserFriends } from "react-icons/fa";
import { GiEarthAmerica } from "react-icons/gi";
import * as PostServices from "../../../services/user/PostServices";
import * as ValidateToken from "../../../utils/token.utils";
import MessageComponent from "../../shared/MessageComponent/MessageComponent";
import ButtonComponent from "../../shared/ButtonComponent/ButtonComponent";

const PostCreateComponent = () => {
  const user = useSelector((state) => state.user);
  const [modalNewPost, setModalNewPost] = useState(false);

  const [modalEmotion, setModalEmotion] = useState(false);
  const [modalSelectBgTextArea, setModalSelectBgTextArea] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedBgTextArea, setSelectedBgTextArea] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "info", key: 0 });
  const [openPrivacyPost, setOpenPrivacyPost] = useState(false);
  const [privacy, setPrivacy] = useState(user.privacyPost);

  const imageRef = useRef();
  const fileRef = useRef();

  const backgroundOptions = [
    { id: 1, class: "" },
    { id: 2, class: "bg-gradient-to-r from-pink-400 to-yellow-400" },
    { id: 3, class: "bg-gradient-to-r from-green-400 to-blue-400" },
    { id: 4, class: "bg-gradient-to-r from-gray-400 to-gray-700" },
    { id: 5, class: "bg-gradient-to-r from-red-400 to-orange-400" },
    { id: 6, class: "bg-gradient-to-r from-indigo-400 to-teal-400" },
  ];

  const emotions = [
    { id: 1, label: "😀 Vui vẻ" },
    { id: 2, label: "😢 Buồn" },
    { id: 3, label: "😡 Tức giận" },
    { id: 4, label: "😍 Hạnh phúc" },
  ];

  const privacyOptions = [
    { id: 1, label: "Công khai", value: "public", icon: <GiEarthAmerica /> },
    { id: 2, label: "Bạn bè", value: "friends", icon: <FaUserFriends /> },
    { id: 3, label: "Chỉ mình tôi", value: "private", icon: <IoMdLock /> },
  ];

  const handleTogglePrivacy = () => setOpenPrivacyPost((prev) => !prev);
  const handleSelectPrivacyPost = (value) => {
    setPrivacy(value);
    setOpenPrivacyPost(false);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const previews = files.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video") ? "video" : "image",
        name: file.name,
      }));
      setMediaList((prev) => [...prev, ...previews]);
      setMediaFiles((prev) => [...prev, ...files]);
      if (!modalNewPost) setModalNewPost(true);
    }
    e.target.value = "";
  };

  const handleFileChange = (e) => {
    const allowedExtensions = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) =>
      allowedExtensions.includes(file.type)
    );
    if (validFiles.length !== files.length)
      alert("Chỉ được tải lên file Word, Excel, PowerPoint hoặc PDF!");
    if (validFiles.length > 0) {
      setFilesList((prev) => [...prev, ...validFiles.map((f) => f.name)]);
      setDocumentFiles((prev) => [...prev, ...validFiles]);
      if (!modalNewPost) setModalNewPost(true);
    }
    e.target.value = "";
  };

  const handleOpenModalEmotion = () => {
    if (!modalNewPost) {
      setModalNewPost(true);
      setModalEmotion(true);
    } else setModalEmotion(true);
  };

  const handleSelectEmotion = (emo) => {
    setSelectedEmotion(emo);
    setModalEmotion(false);
  };

  const handleToggleModalSelectBgTextArea = () =>
    setModalSelectBgTextArea(!modalSelectBgTextArea);

  const handleRemoveMedia = (idx) =>
    setMediaList((prev) => prev.filter((_, i) => i !== idx));
  const handleRemoveFile = (idx) =>
    setFilesList((prev) => prev.filter((_, i) => i !== idx));

  const handleAddNewPost = async () => {
    const content = document.querySelector("textarea").value;
    if (!content) {
      return setMessage({
        text: "Cần thêm nội dung trước khi đăng bài!",
        type: "warning",
        key: Date.now(),
      });
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("content", content);
      formData.append("emotion", selectedEmotion?.label || "");
      formData.append("bgContent", selectedBgTextArea || "");
      formData.append("privacy", privacy || "public");
      mediaFiles.forEach((file) => formData.append("mediaPosts", file));
      documentFiles.forEach((file) => formData.append("documentPosts", file));

      const accessToken = await ValidateToken.getValidAccessToken();
      const res = await PostServices.createNewPost(accessToken, formData);

      if (res) {
        setMessage({
          text: "Đăng bài thành công!",
          type: "success",
          key: Date.now(),
        });
        setMediaList([]);
        setMediaFiles([]);
        setFilesList([]);
        setDocumentFiles([]);
        setSelectedEmotion(null);
        setSelectedBgTextArea("");
        setModalNewPost(false);
      }
    } catch (error) {
      setMessage({
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Đăng bài thất bại!",
        type: "error",
        key: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#252728] shadow-md p-4 rounded-md dark:border-0 border border-gray-200 mb-3">
      {message.text && (
        <MessageComponent
          key={message.key}
          type={message.type}
          message={message.text}
        />
      )}

      {/* Header input post */}
      <div className="flex items-center gap-3">
        <img
          src={user?.userAvatar || LogoCTUT}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover bg-white"
        />
        <button
          onClick={() => setModalNewPost(true)}
          className="flex-1 text-left text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#333334] px-4 py-2 rounded-full cursor-pointer"
        >
          {`${user?.firstName || "Người dùng"} ơi, bạn đang nghĩ gì thế!`}
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex justify-around items-center mt-4">
        <button
          onClick={() => imageRef.current.click()}
          className="flex items-center gap-2 text-green-600 cursor-pointer"
        >
          <ImImages /> Ảnh / Video
        </button>
        <button
          onClick={handleOpenModalEmotion}
          className="flex items-center gap-2 text-yellow-600 cursor-pointer"
        >
          <BsEmojiLaughing /> Cảm xúc của bạn
        </button>
      </div>

      {/* Hidden inputs */}
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        ref={imageRef}
        onChange={handleImageChange}
        hidden
      />
      <input
        type="file"
        multiple
        ref={fileRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        hidden
      />

      {/* Modal New Post */}
      {modalNewPost && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 z-50 overflow-auto">
          <div className="bg-white dark:bg-[#2c2c2c] rounded-lg p-6 w-full max-w-xl relative flex flex-col gap-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold dark:text-white">
                Tạo bài viết
              </h2>
              <button
                onClick={() => setModalNewPost(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <MdOutlineClose size={24} />
              </button>
            </div>

            {/* User info */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={user?.userAvatar || LogoCTUT}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover bg-white"
              />
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {user?.firstName || "Người dùng"}{" "}
                  {selectedEmotion && (
                    <span className="text-gray-500 text-sm">
                      đang cảm thấy {selectedEmotion.label}
                    </span>
                  )}
                </p>
                <div
                  onClick={handleTogglePrivacy}
                  className="flex items-center gap-1 text-gray-500 text-sm relative cursor-pointer"
                >
                  {privacyOptions.find((p) => p.value === privacy)?.icon}{" "}
                  {privacyOptions.find((p) => p.value === privacy)?.label}
                  {openPrivacyPost && (
                    <div className="absolute top-6 -left-3.5 z-50 p-2 dark:bg-[#3c3c3c] w-40 rounded-sm bg-white shadow border border-gray-200 dark:border-[#393939]">
                      {privacyOptions.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleSelectPrivacyPost(p.value)}
                          className="flex items-center gap-1 py-1 px-1.5 dark:hover:bg-[#2c2c2c] cursor-pointer rounded-sm dark:text-white hover:bg-gray-200"
                        >
                          {p.icon} {p.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Textarea + background */}
            <div className={`${selectedBgTextArea} p-2 rounded-md relative`}>
              <textarea
                className={`w-full outline-0 rounded-md h-48 scrollbar-hide dark:text-white resize-none ${
                  selectedBgTextArea ? "text-3xl text-center text-white" : ""
                } bg-transparent`}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) =>
                  e.target.value.trim() === "" && setIsFocused(false)
                }
              />
              {!isFocused && (
                <p
                  className={`absolute ${
                    selectedBgTextArea
                      ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-3xl"
                      : "top-5 left-5 text-gray-500 dark:text-gray-400"
                  } pointer-events-none`}
                >
                  {`${
                    user?.firstName || "Người dùng"
                  } ơi, bạn đang nghĩ gì thế!`}
                </p>
              )}

              {/* Background selector */}
              {mediaList.length === 0 && filesList.length === 0 && (
                <div className="relative mt-3">
                  <button
                    onClick={handleToggleModalSelectBgTextArea}
                    className="p-2 text-2xl rounded-md bg-gray-200 dark:bg-[#3b3b3b] hover:bg-gray-300 dark:hover:bg-[#4a4a4a] flex items-center gap-2 text-gray-700 dark:text-gray-200"
                  >
                    <FaPalette />
                  </button>

                  {modalSelectBgTextArea && (
                    <div className="absolute bottom-0 left-12 mt-2 grid grid-cols-3 gap-2 bg-white dark:bg-[#2c2c2c] p-2 rounded-lg shadow-lg z-50">
                      {backgroundOptions.map((bg) => (
                        <div
                          key={bg.id}
                          onClick={() => {
                            setSelectedBgTextArea(bg.class);
                            setModalSelectBgTextArea(false);
                          }}
                          className={`w-10 h-10 rounded-lg cursor-pointer ${
                            bg.class
                          } border-2 ${
                            selectedBgTextArea === bg.class
                              ? "border-blue-500"
                              : "border-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Media preview */}
            {mediaList.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {mediaList.map((file, idx) => (
                  <div key={idx} className="relative group">
                    {file.type === "video" ? (
                      <video
                        src={file.url}
                        controls
                        className="rounded-lg object-cover w-full h-28"
                      />
                    ) : (
                      <img
                        src={file.url}
                        alt="preview"
                        className="rounded-lg object-cover w-full h-28"
                      />
                    )}
                    <button
                      onClick={() => handleRemoveMedia(idx)}
                      className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTimesCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* File preview */}
            {filesList.length > 0 && (
              <ul className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {filesList.map((name, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-100 dark:bg-[#3b3b3b] px-3 py-2 rounded"
                  >
                    <span>📄 {name}</span>
                    <button
                      onClick={() => handleRemoveFile(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MdOutlineClose />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Footer buttons */}
            <div className="flex items-center justify-between mt-4 border-t pt-2">
              <div>Thêm vào bài viết</div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => imageRef.current.click()}
                  disabled={selectedBgTextArea}
                  className={`p-2 rounded-full text-2xl ${
                    selectedBgTextArea
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-green-600 cursor-pointer"
                  }`}
                >
                  <ImImages />
                </button>
                <button
                  onClick={() => fileRef.current.click()}
                  disabled={selectedBgTextArea}
                  className={`p-2 rounded-full text-2xl ${
                    selectedBgTextArea
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 cursor-pointer"
                  }`}
                >
                  <BsFileEarmarkCheckFill />
                </button>
                <button className="p-2 rounded-full text-2xl text-blue-600 cursor-pointer">
                  <BsTagsFill />
                </button>
                <button
                  onClick={handleOpenModalEmotion}
                  className="p-2 rounded-full text-2xl text-yellow-600 cursor-pointer"
                >
                  <BsEmojiLaughing />
                </button>
              </div>
            </div>

            {/* Submit button */}
            <ButtonComponent
              loading={loading}
              onClick={handleAddNewPost}
              text="Đăng bài"
            />
          </div>
        </div>
      )}

      {/* Modal Emotion */}
      {modalEmotion && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
          <div className="bg-white dark:bg-[#2c2c2c] rounded-lg shadow-lg p-4 w-72">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                Chọn cảm xúc
              </h3>
              <button onClick={() => setModalEmotion(false)}>
                <MdOutlineClose size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {emotions.map((emo) => (
                <button
                  key={emo.id}
                  onClick={() => handleSelectEmotion(emo)}
                  className="text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#3b3b3b]"
                >
                  {emo.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCreateComponent;
