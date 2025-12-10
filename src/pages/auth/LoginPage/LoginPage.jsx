import React, { useState } from "react";
import AvatarDefault from "../../../assets/logo/avatar_default.webp";
import { useNavigate } from "react-router-dom";
import * as AuthServices from "../../../services/shared/AuthServices";
import * as UserServices from "../../../services/shared/UserServices";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../features/user/userSlice";
import MessageComponent from "../../../components/shared/MessageComponent/MessageComponent";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import InputComponent from "../../../components/shared/InputComponent/InputComponent";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();
  const [message, setMessage] = useState({ text: "", type: "info", key: 0 });

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const { email, password } = data;

    if (!email) {
      return setMessage({
        text: "Hãy nhập email của bạn!",
        type: "warning",
        key: Date.now(),
      });
    }

    if (!password) {
      return setMessage({
        text: "Hãy nhập mật khẩu của bạn!",
        type: "warning",
        key: Date.now(),
      });
    }

    setLoading(true);
    try {
      const platform = "web";
      const res = await AuthServices.loginService({
        email,
        password,
        platform,
      });

      const accessToken = res?.data?.accessToken;
      if (!accessToken) {
        return setMessage({
          text: "Lỗi từ máy chủ hãy chờ xử lý!",
          type: "error",
          key: Date.now(),
        });
      }

      localStorage.setItem("accessToken", accessToken);
      const userData = await handleGetDetailUser(accessToken);

      setMessage({
        text: "Đăng nhập thành công!",
        type: "success",
        key: Date.now(),
      });

      setData({ email: "", password: "" });
      setIsSuccess(true);

      setTimeout(() => {
        navigate(userData?.isAdmin ? "/admin" : "/");
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      setMessage({
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.",
        type: "error",
        key: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetDetailUser = async (accessToken) => {
    try {
      const res = await UserServices.getDetailUser(accessToken);
      const user = res?.user;

      if (!user) throw new Error("Không tìm thấy thông tin người dùng!");

      dispatch(updateUser(user));
      return user;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  };

  return (
    <div className="flex items-center justify-center h-screen space-x-8 bg-blue-100">
      {message.text && (
        <MessageComponent
          key={message.key}
          type={message.type}
          message={message.text}
        />
      )}

      {/* Logo và mô tả */}
      <div className="flex flex-col items-center text-center space-y-4">
        <img
          className="w-48 h-48 bg-white rounded-full"
          src={AvatarDefault}
          alt="CTUT Logo"
        />
        <div className="text-blue-700 text-2xl font-bold">
          Đại học Kỹ Thuật - Công Nghệ Cần Thơ
        </div>
        <div className="text-sm text-gray-500 max-w-xs">
          Hãy đăng nhập bằng tài khoản của trường để có trải nghiệm tốt nhất
          nhé.
        </div>
      </div>

      {/* Form đăng nhập */}
      <div className="w-96 bg-white shadow-lg p-6 rounded-2xl space-y-4">
        <InputComponent
          id="email"
          label="Email"
          value={data.email}
          onChange={handleChange}
          placeholder="ctuet.edu.vn"
        />

        <InputComponent
          id="password"
          label="Mật khẩu"
          type="password"
          value={data.password}
          onChange={handleChange}
          placeholder="• • • • • •"
        />

        <div
          onClick={() => navigate("/forgot-password")}
          className="text-blue-600 text-sm text-end hover:underline cursor-pointer"
        >
          Quên mật khẩu?
        </div>

        <ButtonComponent
          text="Đăng nhập"
          onClick={handleSubmit}
          loading={loading}
          sendTranslate={isSuccess}
          disabled={isSuccess}
        />

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
  );
};

export default LoginPage;
