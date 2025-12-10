import React, { useState } from "react";
import { GiEarthAmerica } from "react-icons/gi";
import { IoMdLock } from "react-icons/io";

const GroupIntroduction = ({ groupPrivacy = "public", introduction = "" }) => {
  const [expanded, setExpanded] = useState(false);

  const maxLength = 150; // số ký tự hiển thị khi chưa expand
  const isLong = introduction.length > maxLength;

  const displayedText =
    !expanded && isLong
      ? introduction.slice(0, maxLength) + "..."
      : introduction || "Nhóm học tập chưa có giới thiệu.";

  return (
    <div className="w-1/3 bg-white dark:bg-[#252728] p-5 rounded-xl shadow flex flex-col gap-4 h-1/2">
      <h2 className="text-xl font-bold">Giới thiệu</h2>

      {groupPrivacy === "public" ? (
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <GiEarthAmerica /> Công khai
          </div>
          <p className="text-sm text-gray-600">
            Ai cũng có thể nhìn thấy thành viên và nội dung trong nhóm.
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <IoMdLock /> Riêng tư
          </div>
          <p className="text-sm text-gray-600">
            Chỉ thành viên có thể xem nội dung nhóm.
          </p>
        </div>
      )}

      <p className="text-gray-700 break-all">{displayedText}</p>

      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-blue-600 font-medium hover:underline self-start"
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </div>
  );
};

export default GroupIntroduction;
