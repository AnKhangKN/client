import React, { useState } from "react";
import { PiEyeLight, PiEyeSlashLight } from "react-icons/pi";

const InputComponent = ({
  label = "Label",
  id,
  type = "text",
  value = "",
  onChange,
  placeholder = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isFilled = value && value.trim() !== "";

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Xác định kiểu input
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full">
      <input
        id={id}
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="peer w-full border border-gray-400 rounded-md px-3 py-2
          placeholder-transparent focus:placeholder-gray-400
          focus:border-blue-500 focus:ring-0 outline-none transition-all duration-200"
      />
      <label
        htmlFor={id}
        className={`absolute left-3 bg-white px-1 text-gray-500 transition-all duration-200
          ${
            isFilled
              ? "-top-2 text-blue-600 text-[12px]"
              : "top-3 text-gray-400 text-[14px]"
          }
          peer-focus:-top-2 peer-focus:text-blue-600 peer-focus:text-[12px]
        `}
      >
        {label}
      </label>

      {/* 👁 Nút toggle hiện/ẩn mật khẩu */}
      {type === "password" && (
        <div
          className="absolute right-3 top-2.5 text-2xl text-gray-500 cursor-pointer select-none"
          onClick={togglePassword}
        >
          {showPassword ? <PiEyeSlashLight /> : <PiEyeLight />}
        </div>
      )}
    </div>
  );
};

export default InputComponent;
