import React, { useState } from "react";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import { useNavigate } from "react-router-dom";
import * as AuthServices from "../../../services/shared/AuthServices";
import MessageComponent from "../../../components/shared/MessageComponent/MessageComponent";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import InputComponent from "../../../components/shared/InputComponent/InputComponent";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "info", key: 0 });

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // --- handle input change ---
  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const { lastName, firstName, email, password, confirmPassword } = data;

    if (!lastName)
      return setMessage({
        text: "Hãy nhập họ của bạn.",
        type: "warning",
        key: Date.now(),
      });

    if (!firstName)
      return setMessage({
        text: "Hãy nhập tên của bạn.",
        type: "warning",
        key: Date.now(),
      });

    if (!email)
      return setMessage({
        text: "Hãy nhập email của bạn.",
        type: "warning",
        key: Date.now(),
      });

    if (!password)
      return setMessage({
        text: "Hãy nhập mật khẩu của bạn.",
        type: "warning",
        key: Date.now(),
      });

    if (!confirmPassword) {
      return setMessage({
        text: "Hãy nhập lại mật khẩu của bạn.",
        type: "warning",
        key: Date.now(),
      });
    }

    if (password !== confirmPassword) {
      return setMessage({
        text: "Mật khẩu và xác nhận mật khẩu không chính xác.",
        type: "warning",
        key: Date.now(),
      });
    }

    if (!isAgree)
      return setMessage({
        text: "Vui lòng đồng ý với điều khoản.",
        type: "warning",
        key: Date.now(),
      });

    setLoading(true);
    try {
      await AuthServices.registerService({
        lastName,
        firstName,
        email,
        password,
        confirmPassword,
      });

      setMessage({
        text: "Đăng ký tài khoản thành công!",
        type: "success",
        key: Date.now(),
      });

      setIsSuccess(true);

      setTimeout(() => {
        navigate("/login");
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      setMessage({
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.",
        type: "error",
        key: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen space-x-10 bg-blue-100">
      {message.text && (
        <MessageComponent
          key={message.key}
          type={message.type}
          message={message.text}
        />
      )}

      {/* --- Logo + mô tả bên trái --- */}
      <div className="flex flex-col items-center text-center space-y-4">
        <img
          className="w-48 h-48 bg-white rounded-full shadow"
          src={LogoCTUT}
          alt="CTUT Logo"
        />
        <h1 className="text-blue-700 text-2xl font-bold">
          Đại học Kỹ Thuật - Công Nghệ Cần Thơ
        </h1>
        <p className="text-sm text-gray-500 max-w-xs">
          Hãy đăng ký bằng tài khoản của trường để có trải nghiệm tốt nhất nhé.
        </p>
      </div>

      {/* --- Form đăng ký --- */}
      <div className="p-6 bg-white shadow-lg rounded-2xl">
        <div className="w-[460px]  space-y-5">
          {/* --- Họ và tên --- */}
          <div className="flex gap-4">
            <InputComponent
              id="lastName"
              label="Họ"
              value={data.lastName}
              onChange={handleChange}
              placeholder="Nhập họ của bạn"
            />

            <InputComponent
              id="firstName"
              label="Tên"
              value={data.firstName}
              onChange={handleChange}
              placeholder="Nhập tên của bạn"
            />
          </div>

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

          <InputComponent
            id="confirmPassword"
            label="Nhập lại mật khẩu"
            type="password"
            value={data.confirmPassword}
            onChange={handleChange}
            placeholder="• • • • • •"
          />

          {/* --- Đồng ý điều khoản --- */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={isAgree}
              onChange={(e) => setIsAgree(e.target.checked)}
              className="mt-1"
            />
            <p className="text-sm text-gray-500">
              Tôi đồng ý với{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">
                Chính sách
              </span>{" "}
              và{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">
                Điều khoản
              </span>{" "}
              của nền tảng.
            </p>
          </div>

          {/* --- Nút đăng ký --- */}
          <ButtonComponent
            text="Đăng ký"
            onClick={handleSubmit}
            loading={loading}
            disabled={isSuccess}
            sendTranslate={isSuccess}
          />

          {/* --- Link chuyển sang đăng nhập --- */}
          <div className="flex justify-center items-center gap-2 text-sm">
            <span>Bạn đã có tài khoản?</span>
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-medium hover:underline"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
