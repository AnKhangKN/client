import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReportModal from "./ReportModal/ReportModal";

const ActionPostModal = ({ actionPostModal, handleCloseActionPostModal }) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [reportModal, setReportModal] = useState(null);

  return (
    <div className="bg-black/10 inset-0 z-10 flex justify-center items-center fixed">
      <div className="bg-white rounded-lg flex flex-col text-center w-80">
        {user.id !== actionPostModal.author._id && (
          <div className="flex flex-col">
            <div
              onClick={() => setReportModal(actionPostModal)}
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
          onClick={() => navigate(`/post/${actionPostModal._id}`)}
        >
          Đi tới bài viết
        </div>
        <div className="cursor-pointer border-b border-gray-200 py-2.5">
          Chia sẽ lên...
        </div>

        <div
          className="cursor-pointer py-2.5"
          onClick={handleCloseActionPostModal}
        >
          Hủy
        </div>
      </div>

      {reportModal && (
        <ReportModal
          reportModal={reportModal}
          handleClose={() => setReportModal(null)}
        />
      )}
    </div>
  );
};

export default ActionPostModal;
