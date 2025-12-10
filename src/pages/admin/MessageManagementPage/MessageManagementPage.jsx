import React, { useEffect, useState } from "react";
import TableComponent from "@/components/admin/TableComponent/TableComponent";
import ButtonComponent from "@/components/shared/ButtonComponent/ButtonComponent";
import ReplyModal from "./ReplyModal/ReplyModal";
import * as TokenUtils from "@/utils/token.utils";
import * as ReportServices from "@/services/admin/ReportServices";

const MessageManagementPage = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Người gửi",
      render: (_, row) => row?.reportUser?.email || "Không có dữ liệu",
    },
    {
      title: "Nội dung",
      dataIndex: "reportContent",
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      render: (text) => new Date(text).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "isReplied",
      render: (flag) =>
        flag ? (
          <span className="text-green-600 font-semibold">Đã trả lời</span>
        ) : (
          <span className="text-red-600 font-semibold">Chưa trả lời</span>
        ),
    },
    {
      title: "Hành động",
      render: (_, row) => (
        <ButtonComponent
          text="Trả lời"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedMsg(row);
          }}
          disabled={row.isReplied}
        />
      ),
    },
  ];

  const fetchMess = async () => {
    try {
      const accessToken = await TokenUtils.getValidAccessToken();
      const res = await ReportServices.getReports(accessToken, "System");
      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMess();
  }, []);

  return (
    <>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Quản lý phản hồi</h2>

        <TableComponent
          columns={columns}
          dataSource={messages}
          handleOpenModal={(row) => setSelectedMsg(row)}
        />
      </div>

      {selectedMsg && (
        <ReplyModal
          message={selectedMsg}
          onClose={() => setSelectedMsg(null)}
          onSuccess={() => {
            setSelectedMsg(null);
            fetchMess();
          }}
        />
      )}
    </>
  );
};

export default MessageManagementPage;
