import React, { useEffect, useState, useRef } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoMdLock } from "react-icons/io";
import { BsDashLg } from "react-icons/bs";
import {
  PiArrowsClockwiseLight,
  PiChatCenteredDotsLight,
  PiChatCenteredTextLight,
  PiDotsThreeLight,
  PiHeartFill,
  PiHeartLight,
} from "react-icons/pi";
import { CiLocationArrow1 } from "react-icons/ci";
import { FaUserFriends } from "react-icons/fa";
import { GiEarthAmerica } from "react-icons/gi";
import TextCollapse from "../TextCollapse/TextCollapse";
import MediaLayout from "../MediaLayout/MediaLayout";
import FileItem from "../FileItem/FileItem";
import LogoCTUT from "../../../../assets/logo/logo-ctut.png";
import { formatVietnamTime } from "../../../../utils/formatVietnamTime";
import * as ValidateToken from "../../../../utils/token.utils";
import { useSelector } from "react-redux";
import ModalDetailPost from "../ModalDetailPost/ModalDetailPost";
import * as CommentServices from "../../../../services/user/CommentServices";
import * as HeartServices from "../../../../services/user/HeartServices";
import * as ReportServices from "@/services/shared/ReportServices";
import { useNavigate } from "react-router-dom";

const PostComponent = ({ postsList }) => {
  const [posts, setPosts] = useState([]);
  const [heartedPosts, setHeartedPosts] = useState({});
  const [modalDetailPostId, setModalDetailPostId] = useState(null);
  const user = useSelector((state) => state.user);
  const menuRefs = useRef({});
  const [commentsList, setCommentsList] = useState([]);
  const navigate = useNavigate();
  const [actionPostModal, setActionPostModal] = useState(null);
  const [reportModal, setReportModal] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  useEffect(() => {
    setPosts(postsList || []);

    const initialHearted = {};
    postsList?.forEach((p) => {
      initialHearted[p._id] = p.hearts.some((h) => h.author === user.id);
    });

    setHeartedPosts(initialHearted);
  }, [postsList, user.id]);

  const handleHeartPost = async (postId) => {
    const accessToken = await ValidateToken.getValidAccessToken();
    const targetType = "Post";

    const willHeart = !heartedPosts[postId];

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              heartsCount: willHeart ? p.heartsCount + 1 : p.heartsCount - 1,
              hearts: willHeart
                ? [...p.hearts, { author: user.id }]
                : p.hearts.filter((h) => h.author !== user.id),
            }
          : p
      )
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

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                heartsCount: res.heartsCount,
                hearts: res.isHearted
                  ? [...p.hearts, { author: user.id }]
                  : p.hearts.filter((h) => h.author !== user.id),
              }
            : p
        )
      );

      setHeartedPosts((prev) => ({
        ...prev,
        [postId]: res.isHearted,
      }));
    } catch (error) {
      console.log(error);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                heartsCount: willHeart ? p.heartsCount - 1 : p.heartsCount + 1,
                hearts: willHeart
                  ? p.hearts.filter((h) => h.author !== user.id)
                  : [...p.hearts, { author: user.id }],
              }
            : p
        )
      );

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

  const handleOpenReportModal = (post) => {
    setReportModal(post);
  };

  const handleSendReport = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();

      const data = {
        reportType: "Post",
        reportModels: reportModal?._id,
        reason: selectedReason,
        reportContent: otherReason,
      };

      const report = await ReportServices.createReport(accessToken, data);

      if (report) {
        setReportModal(null);
        setOtherReason("");
        setSelectedReason("");
        setActionPostModal(false);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      setReportModal(null);
      setOtherReason("");
      setSelectedReason("");
      setActionPostModal(false);
      console.log("Lỗi", msg);
    }
  };

  return (
    <>
      {posts.map((item) => (
        <div
          key={item._id}
          className="p-4 shadow rounded-md dark:bg-[#252728] dark:border-0 border border-gray-200"
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
                    <div
                      onClick={() =>
                        navigate(`/profile/${item.author.userName}`)
                      }
                      className="flex gap-2 items-center cursor-pointer"
                    >
                      {item.author.lastName} {item.author.firstName}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <div>{formatVietnamTime(item.createdAt)}</div>
                      <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                      <div className="group relative">
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
                          className="group-hover:block hidden w-20 text-center absolute -right-8 -top-7 bg-gray-600 
                          text-white px-1.5 py-1 text-[12px] rounded-lg"
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
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Menu */}
            <div
              className="flex gap-3 items-center relative"
              ref={(el) => (menuRefs.current[item._id] = el)}
            >
              <div
                className="hover:bg-gray-200 p-1.5 rounded-full group cursor-pointer"
                onClick={() => setActionPostModal(item._id)}
              >
                <HiOutlineDotsHorizontal size={20} />
              </div>

              {actionPostModal === item._id && (
                <div className="bg-black/40 inset-0 z-10 flex justify-center items-center fixed">
                  <div className="bg-white rounded-lg flex flex-col text-center w-80">
                    {user.id !== item.author._id && (
                      <div className="flex flex-col">
                        <div
                          onClick={() => handleOpenReportModal(item)}
                          className="cursor-pointer font-bold text-red-500 border-b border-gray-200 py-2.5"
                        >
                          Báo cáo
                        </div>

                        <div className="cursor-pointer font-bold text-red-500 border-b border-gray-200 py-2.5">
                          Bỏ theo dõi Khang
                        </div>
                      </div>
                    )}

                    <div
                      className="cursor-pointer border-b border-gray-200 py-2.5"
                      onClick={() => navigate(`/post/${item._id}`)}
                    >
                      Đi tới bài viết
                    </div>
                    <div className="cursor-pointer border-b border-gray-200 py-2.5">
                      Chia sẽ lên...
                    </div>

                    <div
                      className="cursor-pointer py-2.5"
                      onClick={() => setActionPostModal(false)}
                    >
                      Hủy
                    </div>
                  </div>
                </div>
              )}

              {reportModal && (
                <div className="fixed inset-0 z-20 bg-black/40 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-lg w-[400px]">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-bold text-lg">Báo cáo</div>
                      <div
                        onClick={() => setReportModal(null)}
                        className="cursor-pointer text-xl"
                      >
                        ×
                      </div>
                    </div>

                    {/* Info */}
                    <div className="mb-3">
                      Đang báo cáo bài viết của tác giả:{" "}
                      <b>
                        {item.author.lastName} {item.author.firstName}
                      </b>
                    </div>

                    {/* Reason select */}
                    <div className="mb-3">
                      <label className="font-medium">Lý do báo cáo:</label>
                      <select
                        className="w-full mt-1 border p-2 rounded"
                        value={selectedReason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                      >
                        <option value="">-- Chọn lý do --</option>
                        <option value="hate">
                          Nội dung thù địch, công kích cá nhân
                        </option>
                        <option value="violence">Kích động bạo lực</option>
                        <option value="spam">Spam hoặc quảng cáo</option>
                        <option value="nudity">
                          Nội dung nhạy cảm / khiêu dâm
                        </option>
                        <option value="illegal">
                          Nội dung vi phạm pháp luật
                        </option>
                        <option value="misinformation">
                          Thông tin sai sự thật
                        </option>
                        <option value="harassment">
                          Quấy rối hoặc bắt nạt
                        </option>
                        <option value="disturbing">
                          Nội dung gây khó chịu
                        </option>
                        <option value="scam">Lừa đảo / gây nguy hiểm</option>
                        <option value="other">Khác...</option>
                      </select>
                    </div>

                    {/* Show textarea when reason = other */}
                    {selectedReason === "other" && (
                      <div className="mb-3">
                        <label className="font-medium">Nhập lý do khác:</label>
                        <textarea
                          className="w-full mt-1 border p-2 rounded"
                          rows="3"
                          placeholder="Nhập lý do báo cáo..."
                          value={otherReason}
                          onChange={(e) => setOtherReason(e.target.value)}
                        ></textarea>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded w-full mt-2"
                      onClick={handleSendReport}
                    >
                      Gửi báo cáo
                    </button>
                  </div>
                </div>
              )}
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
          <ModalDetailPost
            modalDetailPostId={modalDetailPostId}
            commentsList={commentsList}
            item={item}
            handleCloseModal={() => setModalDetailPostId(null)}
          />

          {/* ACTIONS */}
          <div className="flex justify-around items-center text-2xl pt-4 mt-6 border-t border-gray-300 dark:border-0">
            <button
              className={`flex gap-1.5 items-end cursor-pointer hover:bg-gray-100 py-1.5 ${
                item.heartsCount ? "pl-2 pr-2.5" : "pl-2 pr-0.5"
              } rounded-full`}
              onClick={() => handleHeartPost(item._id)}
            >
              {heartedPosts[item._id] ? (
                <PiHeartFill className="text-red-500" />
              ) : (
                <PiHeartLight />
              )}

              <div className="text-[14px]">
                {item.heartsCount !== 0 ? item.heartsCount : ""}
              </div>
            </button>

            <button
              className={`flex gap-1.5 items-end cursor-pointer hover:bg-gray-100 py-1.5 ${
                item.comment ? "pl-2 pr-2.5" : "pl-2 pr-0.5"
              } rounded-full`}
              onClick={() => handleOpenModal(item._id)}
            >
              <PiChatCenteredDotsLight />
              <div className="text-[14px]">
                {item.comment !== 0 ? item.comment : ""}
              </div>
            </button>

            <button
              className={`flex gap-1.5 items-end cursor-pointer hover:bg-gray-100 py-1.5 ${
                item.share ? "pl-1 pr-2" : "pl-2 pr-0.5"
              } rounded-full`}
            >
              <PiArrowsClockwiseLight />
              <div className="text-[14px]">
                {item.share !== 0 ? item.share : ""}
              </div>
            </button>

            <button className="cursor-pointer hover:bg-gray-100 py-1.5 pl-1.5 pr-2 rounded-full">
              <CiLocationArrow1 />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default PostComponent;
