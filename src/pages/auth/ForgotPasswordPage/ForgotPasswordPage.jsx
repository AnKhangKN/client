import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageComponent from "../../../components/shared/MessageComponent/MessageComponent";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import InputComponent from "../../../components/shared/InputComponent/InputComponent";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: "", type: "info", key: 0 });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [data, setData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    setMessage({ text: "", type: "info", key: 0 });
    const { email } = data;

    if (!email) {
      return setMessage({
        text: "Hãy nhập email để reset mật khẩu.",
        type: "warning",
        key: Date.now(),
      });
    }

    setLoading(true);
    try {
      console.log(email);

      setMessage({
        text: "Truy cập mail để nhận lại mật khẩu.",
        type: "success",
        key: Date.now(),
      });

      setIsSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage({
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Lỗi hãy kiểm tra lại thông tin.",
        type: "error",
        key: Date.now(),
      });
    } finally {
      setLoading(false);
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
          src={LogoCTUT}
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

        <ButtonComponent
          text="Đặt lại mật khẩu"
          onClick={handleSubmit}
          loading={loading}
          disabled={isSuccess}
          sendTranslate={isSuccess}
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

export default ForgotPasswordPage;
