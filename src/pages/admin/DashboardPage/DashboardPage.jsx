import React, { useEffect, useState } from "react";
import UserJoinChart from "./UserJoinChart/UserJoinChart";
import * as SharedServices from "@/services/admin/SharedServices";
import * as TokenUtils from "@/utils/token.utils";

const DashboardPage = () => {
  const [user, setUser] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [group, setGroup] = useState([]);
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const accessToken = await TokenUtils.getValidAccessToken();
        const res = await SharedServices.getDashboard(accessToken);
        setUser(res.user);
        setTeacher(res.teacher);
        setGroup(res.group);
        setDepartment(res.department);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDashboard();
  }, []);

  const stats = [
    {
      label: "Người dùng đã tham gia",
      value: user?.length || 0,
      color: "bg-blue-500",
    },
    {
      label: "Giảng viên đã tham gia",
      value: teacher?.length || 0,
      color: "bg-orange-500",
    },
    {
      label: "Các nhóm đã được tạo",
      value: group?.length || 0,
      color: "bg-green-500",
    },
    {
      label: "Các khoa đã được tạo",
      value: department?.length || 0,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="flex flex-col space-y-8 p-6">
      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`shadow-lg rounded-xl p-6 flex flex-col justify-between border border-gray-100 transition-transform transform hover:scale-105 hover:shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <div className="text-gray-500 font-medium">{item.label}</div>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${item.color}`}
              >
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Biểu đồ */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">
          Thống kê người tham gia hệ thống
        </h2>
        <div className="w-full h-[400px]">
          <UserJoinChart user={user} teacher={teacher} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
