import React from "react";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";

const NotificationPage = () => {
  const listNotification = [
    {
      id: "1",
      memberAvatar: LogoCTUT,
      memberName: "Khang",
      content: "đã bắt đầu theo dõi bạn.",
      createAt: "13/10/2024 5h36",
    },
    {
      id: "2",
      memberAvatar: LogoCTUT,
      memberName: "Khang",
      content: "đã bày tỏ cảm xúc vào bài viết của bạn.",
      createAt: "13/10/2024 5h36",
    },
    {
      id: "3",
      memberAvatar: LogoCTUT,
      memberName: "Khang",
      content: "đã bình luận vào bài viết của bạn.",
      createAt: "13/10/2024 5h36",
    },
    {
      id: "4",
      memberAvatar: LogoCTUT,
      memberName: "Khang",
      content: "đã nhắc bạn trong 1 bài viết.",
      createAt: "13/10/2024 5h36",
    },
    {
      id: "5",
      memberAvatar: LogoCTUT,
      memberName: "Khang",
      content: "đã chia sẻ 1 bài viết của bạn.",
      createAt: "13/10/2024 5h36",
    },
  ];

  const listSuggest = [
    { id: "1", memberAvatar: LogoCTUT, memberName: "Khang" },
    { id: "2", memberAvatar: LogoCTUT, memberName: "Khang" },
    { id: "3", memberAvatar: LogoCTUT, memberName: "Khang" },
    { id: "4", memberAvatar: LogoCTUT, memberName: "Khang" },
    { id: "5", memberAvatar: LogoCTUT, memberName: "Khang" },
    { id: "6", memberAvatar: LogoCTUT, memberName: "Khang" },
    { id: "7", memberAvatar: LogoCTUT, memberName: "Khang" },
    { id: "8", memberAvatar: LogoCTUT, memberName: "Khang" },
  ];

  return (
    <div className="bg-white flex justify-center ">
      <div className="w-full max-w-[800px] p-4">
        {/* Tiêu đề */}
        <div className="md:hidden block text-xl font-semibold mb-4">
          Thông báo
        </div>

        {/* Danh sách thông báo */}
        <div className="mb-6">
          <div className="text-base font-medium mb-2">Thông báo cho bạn</div>
          <div className="flex flex-col gap-3">
            {listNotification.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={notification.memberAvatar}
                  alt={notification.memberName}
                />
                <div className="flex flex-col">
                  <span className="text-sm leading-snug">
                    <span className="font-medium">
                      {notification.memberName}
                    </span>{" "}
                    {notification.content}
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">
                    {notification.createAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gợi ý bạn có thể quen */}
        <div className="border-t pt-4">
          <div className="text-base font-medium text-gray-700 mb-2">
            Gợi ý bạn có thể quen
          </div>

          <div className="flex flex-col">
            {listSuggest.map((suggest) => (
              <div
                key={suggest.id}
                className="flex justify-between items-center py-3 hover:bg-gray-50 px-2 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={suggest.memberAvatar}
                    alt={suggest.memberName}
                  />
                  <div className="font-medium text-sm">
                    {suggest.memberName}
                  </div>
                </div>

                <button className="text-sm px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition">
                  Theo dõi
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
