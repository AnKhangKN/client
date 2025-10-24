import React, { useEffect, useState } from "react";
import { BiSolidInfoCircle } from "react-icons/bi";
import { IoIosCloseCircle } from "react-icons/io";
import { IoWarning } from "react-icons/io5";
import { PiCheckCircleFill } from "react-icons/pi";

const MessageComponent = ({ message, type = "info", duration = 4000 }) => {
  const [visible, setVisible] = useState(true);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    const timer = setTimeout(() => setFull(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const typeConfig = {
    info: {
      icon: <BiSolidInfoCircle />,
      textColor: "text-blue-600",
      bgColor: "bg-blue-600",
    },
    success: {
      icon: <PiCheckCircleFill />,
      textColor: "text-green-600",
      bgColor: "bg-green-600",
    },
    warning: {
      icon: <IoWarning />,
      textColor: "text-yellow-500",
      bgColor: "bg-yellow-500",
    },
    error: {
      icon: <IoIosCloseCircle />,
      textColor: "text-red-600",
      bgColor: "bg-red-600",
    },
  };

  const currentType = typeConfig[type] || typeConfig.info;

  if (!visible) return null;

  return (
    <div
      className={`fixed top-5 right-5 shadow transition-all duration-500 ease-in-out transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
      }`}
    >
      {/* Khung thông báo */}
      <div className={`bg-white flex items-center gap-3 px-4 py-3 `}>
        {/* Icon */}
        <div className={`${currentType.textColor} text-2xl`}>
          {currentType.icon}
        </div>

        {/* Nội dung */}
        <div className="text-gray-800 font-medium">{message}</div>
      </div>

      {/* Thanh màu dưới */}
      <div
        className={`${
          currentType.bgColor
        } transition-all ease-in-out duration-3000 h-1 ${
          full ? "w-full" : "w-0"
        }`}
      ></div>
    </div>
  );
};

export default MessageComponent;
