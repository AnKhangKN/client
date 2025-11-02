import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { RiCameraLensFill } from "react-icons/ri";

const ButtonComponent = ({
  text = "Button",
  onClick,
  loading = false,
  disabled = false,
  sendTranslate = false,
  width = "w-full",
  rounded = "rounded-lg",
  bgColor = "bg-indigo-500",
  hoverColor = "hover:bg-indigo-600",
  textColor = "text-white",
  textSize = "text-[16px]",
  py = "py-2",
  px = "",
  iconLeft = "",
  iconRight = "",
}) => {
  const [animateSend, setAnimateSend] = useState(false);

  useEffect(() => {
    if (sendTranslate) {
      setAnimateSend(true);
      const timer = setTimeout(() => setAnimateSend(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [sendTranslate]); // Hiệu ứng máy bay bay ngang button.

  return (
    <button
      onClick={!loading && !disabled ? onClick : undefined}
      disabled={loading || disabled || sendTranslate}
      className={`relative overflow-hidden flex items-center justify-center gap-x-2 ${width} ${bgColor} ${textColor} 
    ${rounded} ${py} ${px} shadow-md transition-all duration-150 ${textSize}
    ${
      loading || disabled
        ? "opacity-80 cursor-not-allowed"
        : `${hoverColor} active:scale-95 cursor-pointer`
    }`}
    >
      {iconLeft && (
        <div className="flex justify-center items-center">{iconLeft}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <AiOutlineLoading3Quarters className="inline-block w-5 h-5 text-white animate-spin" />
          <span>Đang xử lý...</span>
        </div>
      ) : sendTranslate ? (
        <div className="relative flex items-center justify-center w-full">
          <span className="relative z-10 opacity-70 text-blue-600">{text}</span>
          <IoMdSend
            style={{ transitionDuration: "2s" }}
            className={`absolute top-1/2 -translate-y-1/2 text-white w-6 h-6 transition-all ease-in-out
          ${
            animateSend
              ? "translate-x-[550%] opacity-100"
              : "translate-x-[-550%] opacity-0"
          }`}
          />
        </div>
      ) : (
        <span>{text}</span>
      )}

      {iconRight && (
        <div className="flex justify-center items-center">{iconRight}</div>
      )}
    </button>
  );
};

export default ButtonComponent;
