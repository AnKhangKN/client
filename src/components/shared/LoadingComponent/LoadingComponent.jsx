import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoadingComponent = () => (
  <div className="flex flex-col items-center justify-center h-screen gap-3">
    <AiOutlineLoading3Quarters className="text-4xl text-blue-500 animate-spin" />
    <p className="text-lg font-medium text-gray-600 animate-pulse">
      Đang truy cập dữ liệu ...
    </p>
  </div>
);

export default LoadingComponent;
