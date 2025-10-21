import React from "react";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-center h-screen space-x-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <img className="w-48 h-48" src={LogoCTUT} alt="CTUT Logo" />
          <div className="text-blue-700 text-2xl font-bold">
            Đại học Kỹ Thuật - Công Nghệ Cần Thơ
          </div>
          <div className="text-sm text-gray-500 max-w-xs">
            Hãy đăng nhập bằng tài khoản của trường để có trải nghiệm tốt nhất
            nhé.
          </div>
        </div>

        <div className="w-[480px] bg-white shadow-lg p-6 rounded-2xl space-y-4">
          {/* Họ và Tên */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col space-y-1 w-full">
              <label className="font-medium text-gray-700" htmlFor="">
                Họ
              </label>
              <input
                className="border border-gray-300 rounded-lg p-2"
                type="text"
              />
            </div>

            <div className="flex flex-col space-y-1 w-full">
              <label className="font-medium text-gray-700" htmlFor="">
                Tên
              </label>
              <input
                className="border border-gray-300 rounded-lg p-2"
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="example ctuet.edu.vn"
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-medium text-gray-700">Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="flex space-x-2">
            <input type="checkbox" />
            <div className="text-sm text-gray-400">
              Tôi đồng ý với cách{" "}
              <span className="text-blue-600">Chính sách</span> và{" "}
              <span className="text-blue-600">Điều khoản</span> của nền tảng.
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-semibold shadow">
            Đăng ký
          </button>

          <div className="flex justify-center items-center gap-2">
            <div>Bạn đã có tài khoản?</div>
            <div
              className="text-blue-600 cursor-pointer hover:underline font-medium"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
