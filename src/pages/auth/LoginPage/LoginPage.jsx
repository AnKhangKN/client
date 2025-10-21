import React from "react";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
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

        <div className="w-96 bg-white shadow-lg p-6 rounded-2xl space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="example ctuet.edu.vn"
              className="border border-gray-300 rounded-lg p-2 outline-blue-500 focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-medium text-gray-700">Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              className="border border-gray-300 rounded-lg p-2 outline-blue-500 focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <div className="text-blue-600 text-sm text-end hover:underline cursor-pointer">
            Quên mật khẩu?
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-semibold shadow">
            Đăng nhập
          </button>

          <div className="flex justify-center items-center gap-2">
            <div>Bạn chưa có tài khoản?</div>
            <div
              className="text-blue-600 cursor-pointer hover:underline font-medium"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
