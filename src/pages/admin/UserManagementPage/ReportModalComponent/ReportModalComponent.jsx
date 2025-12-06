import React, { useState } from "react";
import ButtonComponent from "@/components/shared/ButtonComponent/ButtonComponent";
import * as ReportServices from "@/services/admin/ReportServices";
import * as TokenUtils from "@/utils/token.utils";
import { formatVietnamTime } from "@/utils/formatVietnamTime";

const ReportModalComponent = ({
  selectedReport,
  setReports,
  handleCloseModal,
}) => {
  // chọn thời gian khóa
  const [banTime, setBanTime] = useState("3");
  const now = new Date();

  if (!selectedReport) return null;
  const user = selectedReport.reportUser;

  // Xác nhận vi phạm
  const handleConfirmReport = async () => {
    try {
      const accessToken = await TokenUtils.getValidAccessToken();

      const data = {
        reportId: selectedReport._id,
        reportType: "User",
        reportModels: selectedReport.reportModels,
        lockedTime: banTime, // thời gian khóa user
      };

      await ReportServices.confirmReport(accessToken, data);

      setReports((prev) =>
        prev.map((r) =>
          r._id === selectedReport._id
            ? { ...r, isConfirm: true, isCancel: false }
            : r
        )
      );

      handleCloseModal();
    } catch (error) {
      console.log(error);
    }
  };

  // Hủy báo cáo
  const handleCancelReport = async () => {
    try {
      const accessToken = await TokenUtils.getValidAccessToken();
      const data = {
        reportId: selectedReport._id,
        reportType: "User",
      };

      await ReportServices.cancelReport(accessToken, data);

      setReports((prev) =>
        prev.map((r) =>
          r._id === selectedReport._id
            ? { ...r, isCancel: true, isConfirm: false }
            : r
        )
      );
      handleCloseModal();
    } catch (error) {
      console.log(error);
    }
  };

  // Gỡ cấm (nếu có nhằm lẫn)
  const handleRemoveReport = async () => {
    try {
      console.log("remove");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={handleCloseModal}
    >
      <div
        className="bg-white p-6 rounded-lg w-[420px] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Chi tiết báo cáo</h2>

        <div className="space-y-4">
          {/* EMAIL */}
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Email:</span>
            <span>{user.email}</span>
          </div>

          {/* LÝ DO */}
          <div className="flex items-start justify-between">
            <span className="font-medium text-gray-600">Lý do:</span>
            <span className="text-gray-800">{selectedReport.reason}</span>
          </div>

          {/* NỘI DUNG */}
          {selectedReport.reportContent && (
            <div>
              <span className="font-medium text-gray-600">Nội dung:</span>
              <span className="mt-1 text-gray-800">
                {selectedReport.reportContent}
              </span>
            </div>
          )}

          <div className="flex items-start justify-between">
            <span className="font-medium text-gray-600">Số lần bị khóa:</span>
            <span className="text-gray-800">
              {selectedReport.reportModels?.lockCount || 0}
            </span>
          </div>

          {!selectedReport.isCancel && (
            <div className="flex items-start justify-between">
              <span className="font-medium text-gray-600">
                Thời gian còn lại:
              </span>
              <span className="text-gray-800">
                {formatVietnamTime(selectedReport.reportModels.lockedTime) || 0}
              </span>
            </div>
          )}

          <div className="flex items-start justify-between">
            <span className="font-medium text-gray-600">Người xử lý:</span>
            <span className="text-gray-800">
              {selectedReport.handledBy?.email || "Chưa có"}
            </span>
          </div>

          {/* CHỌN THỜI GIAN KHÓA */}
          {!selectedReport.isCancel && !selectedReport.isConfirm && (
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">Khóa tài khoản:</span>

              <select
                value={banTime}
                onChange={(e) => setBanTime(e.target.value)}
                className="border px-2 py-1 rounded-md"
              >
                <option value="0">reset</option>
                <option value="3">3 ngày</option>
                <option value="7">7 ngày</option>
                <option value="30">1 tháng</option>
                <option value="forever">Vĩnh viễn</option>
              </select>
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex justify-end space-x-3">
          <ButtonComponent
            text="Đóng"
            onClick={handleCloseModal}
            bgColor="white"
            textColor="text-gray-800"
            hoverColor="hover:bg-gray-200"
          />

          {!selectedReport.isConfirm && !selectedReport.isCancel && (
            <ButtonComponent
              text="Vi phạm"
              bgColor="bg-red-500"
              hoverColor="hover:bg-red-600"
              onClick={handleConfirmReport}
            />
          )}

          {!selectedReport.isConfirm && !selectedReport.isCancel && (
            <ButtonComponent
              text="Hủy"
              bgColor="bg-green-500"
              hoverColor="hover:bg-green-600"
              onClick={handleCancelReport}
            />
          )}

          {selectedReport.isConfirm &&
            new Date(selectedReport.reportModels?.lockedTime) > now && (
              <ButtonComponent
                text="Gỡ khóa"
                bgColor="bg-blue-500"
                hoverColor="hover:bg-blue-600"
                onClick={handleRemoveReport}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default ReportModalComponent;
