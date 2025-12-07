import React, { useEffect, useState } from "react";
import TableComponent from "@/components/admin/TableComponent/TableComponent";
import ButtonComponent from "@/components/shared/ButtonComponent/ButtonComponent";
import ReplyModal from "./ReplyModal/ReplyModal";

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
      dataIndex: "senderName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Chủ đề",
      dataIndex: "subject",
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
      // render nhận 3 tham số: value, row, rowIndex
      render: (_, row) => (
        <ButtonComponent
          title="Trả lời"
          onClick={(e) => {
            e.stopPropagation(); // tránh row click
            setSelectedMsg(row);
          }}
          disabled={row.isReplied}
        />
      ),
    },
  ];

  // MOCK DATA
  const mockMessages = [
    {
      _id: "1",
      senderName: "Nguyễn Văn A",
      email: "vana@example.com",
      subject: "Không đăng được bài viết",
      content: "Em đăng bài nhưng báo lỗi server.",
      createdAt: "2025-01-01T10:15:00",
      isReplied: false,
    },
    {
      _id: "2",
      senderName: "Trần Thị B",
      email: "tranthib@example.com",
      subject: "Góp ý tính năng nhóm",
      content: "Tính năng nhóm nên có thêm quyền phó nhóm.",
      createdAt: "2025-01-02T14:30:00",
      isReplied: true,
    },
    {
      _id: "3",
      senderName: "Phạm Văn C",
      email: "vanc@example.com",
      subject: "Không xem được video",
      content: "Video bị load chậm quá.",
      createdAt: "2025-01-03T09:00:00",
      isReplied: false,
    },
  ];

  // MOCK fetch
  const fetchMessages = async () => {
    setTimeout(() => {
      setMessages(mockMessages);
    }, 500);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Quản lý phản hồi</h2>
        <TableComponent
          columns={columns}
          dataSource={messages}
          handleOpenModal={(row) => setSelectedMsg(row)} // dùng handleOpenModal của TableComponent
        />
      </div>

      {selectedMsg && (
        <ReplyModal
          message={selectedMsg}
          onClose={() => setSelectedMsg(null)}
          onSuccess={() => {
            alert("Mock: đã trả lời!");
            setSelectedMsg(null);
            fetchMessages();
          }}
        />
      )}
    </>
  );
};

export default MessageManagementPage;
