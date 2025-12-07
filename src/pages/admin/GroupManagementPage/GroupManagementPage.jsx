import React, { useEffect, useState } from "react";
import * as TokenUtils from "@/utils/token.utils";
import * as ReportServices from "@/services/admin/ReportServices";
import TableComponent from "@/components/admin/TableComponent/TableComponent";
import ButtonComponent from "@/components/shared/ButtonComponent/ButtonComponent";

const GroupManagementPage = () => {
  const [reportList, setReportList] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPostReport = async () => {
      try {
        const accessToken = await TokenUtils.getValidAccessToken();
        const reportType = "Group";
        const res = await ReportServices.getReports(accessToken, reportType);

        setReportList(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPostReport();
  }, []);

  const columns = [
    { title: "STT", render: (_, __, index) => index + 1 },
    { title: "Nhóm ID", dataIndex: ["reportModels", "_id"] },
    {
      title: "Người báo cáo",
      dataIndex: ["reportUser", "email"],
    },
    { title: "Lý do", dataIndex: "reason" },
    {
      title: "Nội dung báo cáo",
      dataIndex: "reportContent",
    },
    {
      title: "Trạng thái",
      render: (_, record) => {
        if (record.isConfirm)
          return (
            <span className="text-green-500 p-2 bg-green-100">Đã xử lý</span>
          );

        if (record.isCancel)
          return <span className="text-red-500 p-2 bg-red-100">Đã hủy</span>;

        return <span className="text-blue-500 p-2 bg-blue-100">Xử lý</span>;
      },
    },
  ];

  const handleOpenModal = (record) => {
    setSelectedPost(record);
  };

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
            className="bg-white p-6 rounded-xl w-[450px] shadow-2xl max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Thông tin chi tiết báo cáo
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Email người báo cáo:
                </span>
                <span>{selectedPost.reportUser?.email || "Chưa có"}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Lý do:</span>
                <span>{selectedPost.reason}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Nội dung báo cáo:
                </span>
                <span>{selectedPost.reportContent || "-"}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Trạng thái:</span>
                <span
                  className={`font-semibold ${
                    selectedPost.isConfirm
                      ? "text-green-600"
                      : selectedPost.isCancel
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {selectedPost.isConfirm
                    ? "Đã xác nhận"
                    : selectedPost.isCancel
                    ? "Đã hủy"
                    : "Chưa xác nhận"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <ButtonComponent
                text="Hủy báo cáo"
                onClick={handleCancelReport}
                bgColor="white"
                hoverColor="hover:bg-gray-200"
                textColor="text-gray-800"
              />
              <ButtonComponent
                text="Xác nhận báo cáo"
                onClick={handleConfirmReport}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagementPage;
