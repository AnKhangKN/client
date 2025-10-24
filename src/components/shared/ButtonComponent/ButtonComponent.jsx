import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";

const ButtonComponent = ({
  text = "Button",
  onClick,
  loading = false,
  disabled = false,
  sendTranslate = false,
  width = "w-full",
  rounded = "rounded-lg",
  bgColor = "bg-blue-600",
  hoverColor = "hover:bg-blue-700",
  textColor = "text-white",
}) => {
  const [animateSend, setAnimateSend] = useState(false);

  useEffect(() => {
    if (sendTranslate) {
      setAnimateSend(true);
      const timer = setTimeout(() => setAnimateSend(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [sendTranslate]); // Hiệu ứng máy bay bay ngang button.

  return (
    <button
      onClick={!loading && !disabled ? onClick : undefined}
      disabled={loading || disabled || sendTranslate}
      className={`relative overflow-hidden flex items-center justify-center ${width} ${bgColor} ${textColor} ${rounded}
         py-2 shadow-md transition-all duration-150 
        ${
          loading || disabled
            ? "opacity-80 cursor-not-allowed"
            : `${hoverColor} active:scale-95 cursor-pointer`
        }`}
    >
      {/* Trạng thái loading */}
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <AiOutlineLoading3Quarters className="inline-block w-5 h-5 text-white animate-spin" />
          <span>Đang xử lý...</span>
        </div>
      ) : sendTranslate ? (
        // Hiệu ứng gửi icon
        <div className="relative flex items-center justify-center w-full">
          <span className="relative z-10 opacity-70 text-blue-600">{text}</span>
          <IoMdSend
            className={`absolute top-1/2 -translate-y-1/2 text-white w-6 h-6 transition-all duration-[3000ms] ease-in-out
              ${
                animateSend
                  ? "translate-x-[550%] opacity-100"
                  : "translate-x-[-550%] opacity-0"
              }`}
          />
        </div>
      ) : (
        text
      )}
    </button>
  );
};

export default ButtonComponent;
