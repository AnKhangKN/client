import React, { useState } from "react";
import * as ValidateToken from "@/utils/token.utils";
import * as ReportServices from "@/services/shared/ReportServices";

const ReportModal = ({ reportModal, handleClose }) => {
  const [otherReason, setOtherReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");

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
        handleClose;
        setOtherReason("");
        setSelectedReason("");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Đã xảy ra lỗi";
      setOtherReason("");
      setSelectedReason("");
      console.log("Lỗi", msg);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-20 bg-black/10 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg w-[400px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="font-bold text-lg">Báo cáo</div>
            <div onClick={handleClose} className="cursor-pointer text-xl">
              ×
            </div>
          </div>

          {/* Info */}
          <div className="mb-3">
            Đang báo cáo bài viết của tác giả:{" "}
            <b>
              {reportModal.author?.lastName} {reportModal.author?.firstName}
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
              <option value="hate">Nội dung thù địch, công kích cá nhân</option>
              <option value="violence">Kích động bạo lực</option>
              <option value="spam">Spam hoặc quảng cáo</option>
              <option value="nudity">Nội dung nhạy cảm / khiêu dâm</option>
              <option value="illegal">Nội dung vi phạm pháp luật</option>
              <option value="misinformation">Thông tin sai sự thật</option>
              <option value="harassment">Quấy rối hoặc bắt nạt</option>
              <option value="disturbing">Nội dung gây khó chịu</option>
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
    </div>
  );
};

export default ReportModal;
