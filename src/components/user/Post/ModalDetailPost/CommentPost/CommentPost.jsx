import React, { useEffect, useState } from "react";
import LogoCTUT from "@/assets/logo/logo-ctut.png";
import * as ValidateToken from "@/utils/token.utils";
import * as CommentServices from "@/services/user/CommentServices";
import * as HeartServices from "@/services/user/HeartServices";
import { formatVietnamTime } from "@/utils/formatVietnamTime";
import { useSelector } from "react-redux";
import { PiHeartFill, PiHeartLight } from "react-icons/pi";
import { RiMoreLine } from "react-icons/ri";
import FileItem from "../../FileItem/FileItem";

const CommentPost = ({
  commentList,
  setReplyingTo,
  visibleReplies,
  setVisibleReplies,
}) => {
  const user = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [heartedComments, setHeartedComments] = useState({});
  const [selectedCommentForMenu, setSelectedCommentForMenu] = useState(null);
  const [showLoadMore, setShowLoadMore] = useState(true);

  // --- Sync comments + hearted state ---
  useEffect(() => {
    setComments(commentList || []);
    const initialHearted = {};
    (commentList || []).forEach((c) => {
      initialHearted[c._id] =
        c.hearts?.some((h) => h.author === user.id) || false;
    });
    setHeartedComments(initialHearted);
  }, [commentList, user.id]);

  // --- Update heart helper ---
  const updateHeartForComment = (comment, res) => ({
    ...comment,
    heartsCount: res.heartsCount,
    hearts: res.isHearted
      ? [...(comment.hearts || []), { author: user.id }]
      : (comment.hearts || []).filter((h) => h.author !== user.id),
  });

  // --- Handle heart/like ---
  const handleHeartComment = async (commentId) => {
    try {
      const token = await ValidateToken.getValidAccessToken();
      const res = await HeartServices.heartTarget(token, commentId, "Comment");

      // Update top-level comments
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? updateHeartForComment(c, res) : c
        )
      );

      // Update replies if loaded
      setVisibleReplies((prev) => {
        const newReplies = { ...prev };
        for (const key in newReplies) {
          newReplies[key] = newReplies[key].map((r) =>
            r._id === commentId ? updateHeartForComment(r, res) : r
          );
        }
        return newReplies;
      });

      setHeartedComments((prev) => ({ ...prev, [commentId]: res.isHearted }));
    } catch (error) {
      console.error(error);
    }
  };

  // --- Load replies ---
  const handleRepliesComment = async (parentId) => {
    try {
      const token = await ValidateToken.getValidAccessToken();
      const res = await CommentServices.getCommentsReplyByCommentId(
        token,
        parentId
      );
      setVisibleReplies((prev) => ({ ...prev, [parentId]: res || [] }));
      setShowLoadMore(false);
    } catch (error) {
      console.error(error);
    }
  };

  // --- Toggle menu ---
  const toggleMenu = (comment) => {
    setSelectedCommentForMenu((prev) =>
      prev && prev._id === comment._id ? null : comment
    );
  };

  // --- Comment item ---
  const CommentItem = React.memo(({ c, isReply = false }) => {
    const isHearted =
      heartedComments[c._id] || c.hearts?.some((h) => h.author === user.id);

    return (
      <div className={`${isReply ? "ml-6" : ""} mt-3 space-y-2`}>
        <div className="flex gap-2">
          <img
            src={c.author?.userAvatar || LogoCTUT}
            alt=""
            className="w-7 h-7 rounded-full object-cover"
          />
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">
                {`${c.author?.lastName || ""} ${c.author?.firstName || ""}`}
              </div>
              <div className="text-xs text-gray-400">
                {formatVietnamTime(c.createdAt)}
              </div>
            </div>

            {/* Content + heart */}
            <div className="flex justify-between items-center bg-gray-100 rounded px-2 py-1 mt-1">
              <div className="text-sm text-gray-800">{c.content}</div>
              <button
                onClick={() => handleHeartComment(c._id)}
                className="flex items-center gap-1"
              >
                {isHearted ? (
                  <PiHeartFill className="text-red-500" />
                ) : (
                  <PiHeartLight />
                )}
                <span className="text-sm">{c.heartsCount || 0}</span>
              </button>
            </div>

            {/* Media */}
            {c.medias?.length > 0 && (
              <div className="flex gap-2 mt-2">
                {c.medias.map((m) => (
                  <div
                    key={m._id || m.url}
                    className="w-24 h-16 overflow-hidden rounded"
                  >
                    {m.type?.startsWith("image") ? (
                      <img
                        src={m.url}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <video
                        src={m.url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Documents */}
            {c.documents?.length > 0 && (
              <div className="mt-2">
                {c.documents.map((d) => (
                  <FileItem key={d._id || d.url} file={d} />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center p-2">
              <div className="flex gap-3 items-center text-sm text-gray-500">
                <div
                  className="cursor-pointer"
                  onClick={() => setReplyingTo(c)}
                >
                  Reply
                </div>
                <div
                  className="p-1 rounded-full hover:bg-gray-100 cursor-pointer relative"
                  onClick={() => toggleMenu(c)}
                >
                  <RiMoreLine />
                  {selectedCommentForMenu?._id === c._id && (
                    <div className="absolute right-0 mt-1 bg-white shadow-lg rounded p-1 w-24 z-50">
                      <div className="p-1 cursor-pointer hover:bg-gray-100">
                        Chỉnh sửa
                      </div>
                      <div className="p-1 cursor-pointer hover:bg-gray-100">
                        Xóa
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {c.repliesCount > 0 && showLoadMore && (
                <div
                  className="cursor-pointer text-blue-500 text-sm"
                  onClick={() => handleRepliesComment(c._id)}
                >
                  Xem thêm {c.repliesCount} trả lời
                </div>
              )}
            </div>

            {/* Replies */}
            {visibleReplies[c._id] && (
              <div className="space-y-2">
                {visibleReplies[c._id].map((r) => (
                  <CommentItem key={r._id} c={r} isReply={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="space-y-3">
      {comments.length > 0 ? (
        comments.map((c) => <CommentItem key={c._id} c={c} />)
      ) : (
        <div className="text-sm text-gray-500">Chưa có bình luận</div>
      )}
    </div>
  );
};

export default CommentPost;
