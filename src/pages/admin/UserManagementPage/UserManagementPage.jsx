import React, { useEffect, useState } from "react";
import TableComponent from "../../../components/admin/TableComponent/TableComponent";
import * as UserServices from "../../../services/admin/UserServices";
import * as TokenUtils from "../../../utils/token.utils";

const UserManagementPage = () => {
  const columns = [
    { title: "ID", dataIndex: "_id" },
    {
      title: "Họ và Tên",
      render: (_, record) =>
        `${record.lastName || ""} ${record.firstName || ""}`,
    },
    { title: "Tên người dùng", dataIndex: "userName" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Cấp bậc",
      dataIndex: "isTeacher",
      render: (isTeacher) => (
        <span
          className={`px-2 py-1.5 text-sm font-medium rounded-md ${
            isTeacher
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {isTeacher ? "Giảng viên" : "Sinh viên"}
        </span>
      ),
    },
  ];

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = await TokenUtils.getValidAccessToken();

        const res = await UserServices.getUsers(accessToken);

        setUser(res.users);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <div className="p-6 bg-white shadow-lg rounded-sm">
        <TableComponent columns={columns} dataSource={user} />
      </div>
    </div>
  );
};

export default UserManagementPage;
