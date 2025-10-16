import React, { useState, useRef, useEffect } from "react";
import { BsDashLg } from "react-icons/bs";

const TextCollapse = ({ text, maxLines = 2 }) => {
  const [expanded, setExpanded] = useState(false);
  const [isLongText, setIsLongText] = useState(false);
  const textRef = useRef(null);

  // 🔍 Kiểm tra xem nội dung có dài hơn 2 dòng không
  useEffect(() => {
    const el = textRef.current;
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * maxLines;
      if (el.scrollHeight > maxHeight) {
        setIsLongText(true);
      }
    }
  }, [text, maxLines]);

  return (
    <div className="text-gray-800 pt-4">
      <div
        ref={textRef}
        className={`transition-all duration-300 ${
          expanded ? "" : "overflow-hidden"
        }`}
        style={
          expanded
            ? {}
            : {
                display: "-webkit-box",
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: "vertical",
              }
        }
      >
        {text}
      </div>

      {/* Chỉ hiển thị nếu nội dung dài */}
      {isLongText && (
        <div
          onClick={() => setExpanded(!expanded)}
          className="text-gray-600 text-sm font-medium mt-1 cursor-pointer select-none"
        >
          {expanded ? (
            <div className="flex gap-2 items-center">
              <BsDashLg /> Thu gọn <BsDashLg />
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <BsDashLg /> Xem thêm <BsDashLg />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextCollapse;
