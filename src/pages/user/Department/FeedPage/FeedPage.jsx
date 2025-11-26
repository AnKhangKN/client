import React from "react";

const FeedPage = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="text-xl font-semibold text-gray-700 mb-4">
        Bài viết đoàn khoa chỉ dành cho giảng viên đăng bài.
      </div>

      {/* Ví dụ bài viết */}
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
          <div className="font-semibold text-gray-800">
            Thông báo về học phần mới
          </div>
          <div className="text-gray-600 mt-1 text-sm">
            Đây là nội dung bài viết ví dụ cho đoàn khoa Công nghệ thông tin.
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
          <div className="font-semibold text-gray-800">
            Thông tin lịch trình hoạt động
          </div>
          <div className="text-gray-600 mt-1 text-sm">
            Thông tin lịch trình sinh hoạt và các sự kiện của khoa Hệ thống
            thông tin.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
