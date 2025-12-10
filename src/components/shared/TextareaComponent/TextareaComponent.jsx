import React from "react";

const TextareaComponent = ({
  id,
  label = "Label text area",
  value = "",
  onChange,
  onFocus,
  onBlur,
  placeholder = "",
}) => {
  const isFilled = value && value.trim() !== "";

  return (
    <div className="relative w-full">
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className="peer w-full border border-gray-400 rounded-md px-3 py-2
          placeholder-transparent focus:placeholder-gray-400
          focus:border-blue-500 focus:ring-0 outline-none transition-all duration-200
          min-h-[100px]"
      />

      <label
        htmlFor={id}
        className={`absolute left-2 bg-white dark:bg-[#3a3a3a] px-1 text-gray-500 transition-all duration-200
          ${
            isFilled
              ? "-top-2 text-blue-600 text-[12px]"
              : "top-2.5 text-gray-400 text-[14px]"
          }
          peer-focus:-top-2 peer-focus:text-blue-600 peer-focus:text-[12px]
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default TextareaComponent;
