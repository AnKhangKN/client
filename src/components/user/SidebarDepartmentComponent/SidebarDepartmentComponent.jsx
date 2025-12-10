import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SidebarDepartmentComponent = ({ departments }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [departmentList, setDepartmentList] = useState([]);

  useEffect(() => {
    setDepartmentList(departments);
  }, [departments]);

  // Tạo menu, encodeURIComponent để tránh lỗi URL với dấu tiếng Việt
  const menuItems = [
    { label: "Tổng quan", path: "/department/feed" },
    ...departmentList.map((de) => ({
      label: de.departmentName,
      path: `/department/feed/${encodeURIComponent(de.departmentName)}/${
        de._id
      }`,
    })),
  ];

  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col overflow-hidden h-screen">
      <div className="px-6 py-4 font-semibold text-gray-700 border-b border-gray-200">
        Danh sách đoàn khoa
      </div>

      <div className="flex-1 overflow-y-auto">
        {menuItems.map((item, idx) => {
          // Highlight active tab
          const isActive =
            path === item.path ||
            (item.path.startsWith("/department/feed/") &&
              path.startsWith("/department/feed/") &&
              item.label === decodeURIComponent(path.split("/")[3]));

          return (
            <div
              key={idx}
              onClick={() => navigate(item.path)}
              className={`px-6 py-3 cursor-pointer rounded-md transition-all ${
                isActive
                  ? "bg-gray-100 font-semibold text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarDepartmentComponent;
