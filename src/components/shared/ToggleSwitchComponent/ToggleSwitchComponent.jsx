import React from "react";

const ToggleSwitchComponent = ({
  toggleStatus,
  action,
  status,

  // 👇 Tuỳ chỉnh kích thước
  width = 60, // px (tương đương w-16)
  height = 32, // px (tương đương h-9)
  circle = 24, // px (tương đương w-7 h-7)
}) => {
  return (
    <div
      onClick={toggleStatus}
      className={`cursor-pointer transition-all duration-300 ease-out rounded-full relative`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: action === status ? "#6366F1" : "#D1D5DB", // indigo-500 / gray-300
      }}
    >
      <div
        className="absolute bg-white rounded-full transition-all duration-300 ease-out"
        style={{
          width: `${circle}px`,
          height: `${circle}px`,
          top: (height - circle) / 2 + "px",
          left:
            action === status
              ? width - circle - (height - circle) / 2 + "px"
              : (height - circle) / 2 + "px",
        }}
      ></div>
    </div>
  );
};

export default ToggleSwitchComponent;
