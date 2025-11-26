import React, { useState } from "react";
import ToggleSwitchComponent from "../../../components/shared/ToggleSwitchComponent/ToggleSwitchComponent";
import { PiHeartFill } from "react-icons/pi";
import { IoCalendar } from "react-icons/io5";

const ActivitiesPage = () => {
  const [activitiesAccount, setActivitiesAccount] = useState("online");
  const [activitiesShow, setActivitiesShow] = useState("interaction");
  const [activitiesInteraction, setActivitiesInteraction] = useState("like");

  const toggleStatus = () => {
    setActivitiesAccount(activitiesAccount === "online" ? "offline" : "online");
  };

  return (
    <div className="p-6">
      {/* Trạng thái tài khoản */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between bg-white p-6 shadow rounded-lg border border-gray-200">
          <div className="text-lg font-semibold text-gray-700">
            Trạng thái tài khoản
          </div>
          <ToggleSwitchComponent
            toggleStatus={toggleStatus}
            action={activitiesAccount}
            status={"online"}
          />
        </div>
      </div>

      {/* Hoạt động */}
      <div className="flex w-full shadow rounded-lg border border-gray-200 bg-white">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 p-6">
          <div className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">
            Hoạt động của bạn
          </div>

          <div className="flex flex-col space-y-4">
            <div
              className={`flex items-start space-x-3 cursor-pointer p-2 rounded-lg transition-all hover:bg-gray-50 ${
                activitiesShow === "interaction" && "bg-gray-100"
              }`}
              onClick={() => setActivitiesShow("interaction")}
            >
              <div className="mt-1">
                <PiHeartFill />
              </div>
              <div>
                <div>Tương tác</div>
                <div className="text-xs text-gray-500">
                  Xem lại các bài viết hoặc các bình luận đã từng tương tác.
                </div>
              </div>
            </div>

            <div
              className={`flex items-start space-x-3 cursor-pointer p-2 rounded-lg transition-all hover:bg-gray-50 ${
                activitiesShow === "account" && "bg-gray-100"
              }`}
              onClick={() => setActivitiesShow("account")}
            >
              <div className="mt-1">
                <IoCalendar />
              </div>
              <div>
                <div>Lịch sử tài khoản</div>
                <div className="text-xs text-gray-500">
                  Xem lại lịch sử đã chỉnh sửa tài khoản.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 p-6 h-[540px]">
          {/* Tương tác */}
          {activitiesShow === "interaction" && (
            <>
              {/* Tabs Like/Comment */}
              <div className="flex gap-6 border-b border-gray-200 mb-4 font-semibold text-gray-700">
                <div
                  className={`cursor-pointer pb-2 ${
                    activitiesInteraction === "like"
                      ? "border-b-2 border-gray-600"
                      : "hover:text-gray-800"
                  }`}
                  onClick={() => setActivitiesInteraction("like")}
                >
                  Lượt thích
                </div>
                <div
                  className={`cursor-pointer pb-2 ${
                    activitiesInteraction === "comment"
                      ? "border-b-2 border-gray-600"
                      : "hover:text-gray-800"
                  }`}
                  onClick={() => setActivitiesInteraction("comment")}
                >
                  Bình luận
                </div>
              </div>

              {/* Nội dung */}
              <div className="p-4 bg-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-y-auto h-[400px]">
                  {activitiesInteraction === "like" && (
                    <div className="text-gray-600">Danh sách like</div>
                  )}
                  {activitiesInteraction === "comment" && (
                    <div className="text-gray-600">Danh sách comment</div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Lịch sử tài khoản */}
          {activitiesShow === "account" && (
            <div>
              <div className="pb-2 mb-4 font-semibold text-gray-700">
                Lịch sử tài khoản
              </div>
              <div className="p-4 bg-gray-200 rounded-lg overflow-hidden text-gray-600">
                <div className="overflow-y-auto h-[400px]">danh sách</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
