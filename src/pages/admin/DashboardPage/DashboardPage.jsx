import React from "react";

const DashboardPage = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="shadow-md rounded-lg flex flex-col space-y-2 border border-gray-200 p-4">
        <div className="text-xl">Người dùng đã tham gia</div>
        <div className="flex items-center space-x-1">
          <div>30</div>
          <div>người dùng</div>
        </div>
      </div>

      <div className="shadow-md rounded-lg flex flex-col space-y-2 border border-gray-200 p-4">
        <div className="text-xl">Giảng viên đã tham gia</div>
        <div className="flex items-center space-x-1">
          <div>30</div>
          <div>người dùng</div>
        </div>
      </div>

      <div className="shadow-md rounded-lg flex flex-col space-y-2 border border-gray-200 p-4">
        <div className="text-xl">Các nhóm đã được tạo</div>
        <div className="flex items-center space-x-1">
          <div>30</div>
          <div>nhóm</div>
        </div>
      </div>

      <div className="shadow-md rounded-lg flex flex-col space-y-2 border border-gray-200 p-4">
        <div className="text-xl">Các khoa đã được tạo</div>
        <div className="flex items-center space-x-1">
          <div>30</div>
          <div>khoa</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
