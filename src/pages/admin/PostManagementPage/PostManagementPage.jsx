import React, { useEffect, useState } from "react";
import * as TokenUtils from "@/utils/token.utils";
import * as ReportServices from "@/services/admin/ReportServices";
import TableComponent from "@/components/admin/TableComponent/TableComponent";
import ButtonComponent from "@/components/shared/ButtonComponent/ButtonComponent";

const PostManagementPage = () => {
  const [reportList, setReportList] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPostReport = async () => {
      try {
        const accessToken = await TokenUtils.getValidAccessToken();
        const reportType = "Post";
        const res = await ReportServices.getReports(accessToken, reportType);

        setReportList(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPostReport();
  }, []);

  const columns = [
    { title: "ID báo cáo", dataIndex: "_id", key: "_id" },
    { title: "Bài viết ID", dataIndex: "reportModels", key: "reportModels" },
    {
      title: "Người báo cáo",
      dataIndex: ["reportUser", "email"],
      key: "reportUser",
    },
    { title: "Lý do", dataIndex: "reason", key: "reason" },
    {
      title: "Nội dung báo cáo",
      dataIndex: "reportContent",
      key: "reportContent",
    },
    {
      title: "Trạng thái xác nhận",
      key: "isConfirm",
      render: (text, record) =>
        record.isConfirm ? "Đã xác nhận" : "Chưa xác nhận",
    },
    {
      title: "Trạng thái hủy",
      key: "isCancel",
      render: (text, record) => (record.isCancel ? "Đã hủy" : "Chưa hủy"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString("vi-VN"),
    },
  ];

  const handleOpenModal = (record) => {
    setSelectedPost(record);
  };

  console.log(selectedPost);

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleConfirmReport = async () => {
    try {
      const data = {
        reportId: selectedPost?._id,
        reportType: selectedPost?.reportType,
        reportModels: selectedPost?.reportModels,
      };

      const accessToken = await TokenUtils.getValidAccessToken();

      const res = await ReportServices.confirmReport(accessToken, data);

      console.log(res);

      console.log("Xác nhận đã xử lý");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelReport = async () => {
    try {
      console.log("Xác nhận không xử lý");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <TableComponent
        dataSource={reportList}
        columns={columns}
        handleOpenModal={handleOpenModal}
      />

      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded-lg w-[400px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Thông tin chi tiết</h2>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  Email người báo cáo:
                </span>
                <span>{selectedPost.reportUser?.email || "Chưa có"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Lý do:</span>
                <span>{selectedPost.reason}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  Nội dung báo cáo:
                </span>
                <span>{selectedPost.reportContent || "-"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Trạng thái:</span>
                <span>
                  {selectedPost.isConfirm
                    ? "Đã xác nhận"
                    : selectedPost.isCancel
                    ? "Đã hủy"
                    : "Chưa xác nhận"}
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-between items-center gap-4">
              <ButtonComponent
                text={`Cancel report`}
                onClick={handleCancelReport}
                bgColor="white"
                hoverColor="hover:bg-gray-200"
                textColor="text-gray-800"
              />

              <ButtonComponent
                text={`Confirm report`}
                onClick={handleConfirmReport}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManagementPage;
