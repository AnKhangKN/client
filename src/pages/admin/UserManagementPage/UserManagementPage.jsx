import React, { useEffect, useState } from "react";
import TableComponent from "../../../components/admin/TableComponent/TableComponent";
import * as UserServices from "../../../services/admin/UserServices";
import * as ReportServices from "@/services/admin/ReportServices";
import * as TokenUtils from "../../../utils/token.utils";
import InputComponent from "@/components/shared/InputComponent/InputComponent";
import UserModalComponent from "./UserModalComponent/UserModalComponent";
import ReportModalComponent from "./ReportModalComponent/ReportModalComponent";

const UserManagementPage = () => {
  const [tab, setTab] = useState("User"); // "User" | "Report"
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");

  // ---------------------- Columns ---------------------------
  const columnsUser = [
    { title: "STT", render: (_, __, index) => index + 1 },
    {
      title: "Họ và Tên",
      render: (_, record) =>
        `${record.lastName ?? ""} ${record.firstName ?? ""}`,
    },
    { title: "Tên người dùng", dataIndex: "userName" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Cấp bậc",
      render: (_, record) => {
        const { isTeacher, isAdmin } = record;

        let label = "Sinh viên";
        let style = "bg-gray-100 text-gray-600";

        if (isTeacher) {
          label = "Giảng viên";
          style = "bg-blue-100 text-blue-600";
        } else if (isAdmin) {
          label = "Admin";
          style = "bg-green-100 text-green-600";
        }

        return (
          <span
            className={`px-2 py-1.5 text-sm font-medium rounded-md ${style}`}
          >
            {label}
          </span>
        );
      },
    },
  ];

  const columnsUserReport = [
    { title: "STT", render: (_, __, index) => index + 1 },
    {
      title: "Người report",
      render: (_, record) => record.reportUser?.email ?? "Không có",
    },
    {
      title: "Người bị report",
      render: (_, record) => record.reportModels?.email ?? "Không có",
    },
    { title: "Lý do", dataIndex: "reason" },
    { title: "Nội dung", dataIndex: "reportContent" },
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

  // -------------------------- Fetch --------------------------
  const fetchUsers = async () => {
    try {
      const token = await TokenUtils.getValidAccessToken();
      const res = await UserServices.getUsers(token);
      setUsers(res.users);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchReports = async () => {
    try {
      const token = await TokenUtils.getValidAccessToken();
      const res = await ReportServices.getReports(token, "User");
      setReports(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // -------------------- Filter Logic -------------------------
  const filteredUsers =
    tab === "User"
      ? users.filter((u) =>
          u.email?.toLowerCase().includes(searchEmail.toLowerCase())
        )
      : reports.filter((r) =>
          r.reportUser?.email
            ?.toLowerCase()
            ?.includes(searchEmail.toLowerCase())
        );

  // ---------------------- Render -----------------------------
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4 items-center">
          <button
            className={`border border-gray-600 px-4 py-3 rounded-lg ${
              tab === "User" && "bg-gray-600 text-white"
            }`}
            onClick={() => {
              setTab("User");
              fetchUsers();
            }}
          >
            Người dùng
          </button>

          <button
            className={`border border-gray-600 px-4 py-3 rounded-lg ${
              tab === "Report" && "bg-gray-600 text-white"
            }`}
            onClick={() => {
              setTab("Report");
              fetchReports();
            }}
          >
            Tài khoản bị báo cáo
          </button>
        </div>

        <div className="w-72">
          <InputComponent
            label="Tìm bằng email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6 bg-white shadow-lg border border-gray-200 rounded-lg">
        <TableComponent
          columns={tab === "User" ? columnsUser : columnsUserReport}
          dataSource={filteredUsers}
          handleOpenModal={(record) => {
            setSelectedUser(record); // lưu record của dòng được click
          }}
        />

        {tab === "User" ? (
          <UserModalComponent
            handleCloseModal={() => setSelectedUser(null)}
            selectedUser={selectedUser}
            setUser={setUsers}
          />
        ) : (
          <ReportModalComponent
            selectedReport={selectedUser} // đổi tên prop cho đúng nghĩa
            handleCloseModal={() => setSelectedUser(null)}
            setReports={setReports}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
