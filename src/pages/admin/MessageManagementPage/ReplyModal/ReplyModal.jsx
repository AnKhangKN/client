import React, { useState } from "react";
import ButtonComponent from "@/components/shared/ButtonComponent/ButtonComponent";

const ReplyModal = ({ message, onClose, onSuccess }) => {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendReply = async () => {
    if (!reply.trim()) return alert("Vui lòng nhập nội dung trả lời!");

    // MOCK gửi
    setLoading(true);

    setTimeout(() => {
      console.log("Mock gửi reply:", {
        messageId: message._id,
        reply,
      });

      alert("Mock: đã gửi phản hồi!");
      setLoading(false);
      onSuccess(); // refresh mock data
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-[500px] rounded-lg p-5 shadow-lg">
        <h3 className="text-xl font-bold mb-3">Trả lời phản hồi</h3>

        <div className="mb-3">
          <p className="font-semibold">Người gửi:</p>
          <p>
            {message.senderName} ({message.email})
          </p>
        </div>

        <div className="mb-3">
          <p className="font-semibold">Nội dung:</p>
          <p className="bg-gray-100 p-2 rounded">{message.content}</p>
        </div>

        <textarea
          className="w-full border rounded p-2 h-28"
          placeholder="Nhập nội dung trả lời..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">
          <ButtonComponent text="Hủy" onClick={onClose} />
          <ButtonComponent
            text={loading ? "Đang gửi..." : "Gửi phản hồi"}
            onClick={handleSendReply}
          />
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
