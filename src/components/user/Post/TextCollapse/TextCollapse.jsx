import React, { useState, useRef, useEffect } from "react";
import { BsDashLg } from "react-icons/bs";

const TextCollapse = ({ text, maxLines = 2, bgColor = "", haveFiles = "" }) => {
  const [expanded, setExpanded] = useState(false);
  const [isLongText, setIsLongText] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * maxLines;
      setIsLongText(el.scrollHeight > maxHeight);
    }
  }, [text, maxLines]);

  return (
    <div
      className={`mt-4 ${bgColor} rounded-sm ${
        bgColor
          ? haveFiles?.length > 0
            ? "px-3 py-3 text-white"
            : "text-center px-3 py-40 text-4xl text-white"
          : ""
      }`}
    >
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

      {isLongText && (
        <div
          onClick={() => setExpanded(!expanded)}
          className="text-gray-600 text-sm font-medium mt-1 cursor-pointer select-none flex items-center justify-center gap-2"
        >
          <BsDashLg />
          {expanded ? "Thu gọn" : "Xem thêm"}
          <BsDashLg />
        </div>
      )}
    </div>
  );
};

export default TextCollapse;
