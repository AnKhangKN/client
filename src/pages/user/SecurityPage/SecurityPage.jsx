import React, { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import { PiNotePencilLight } from "react-icons/pi";
import InputComponent from "../../../components/shared/InputComponent/InputComponent";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import useClickOutside from "../../../hooks/useClickOutside";
import { useSelector } from "react-redux";

const SecurityPage = () => {
  // const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const modalTypeRef = useRef(null);
  const user = useSelector((state) => state.user);

  const closeModal = () => {
    setModalType(null);
    setEmail("");
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleSave = () => {
    if (modalType === "email") {
      if (!email.includes("@")) return alert("Email không hợp lệ!");
      console.log("Cập nhật email:", email);
    } else if (modalType === "password") {
      if (!oldPassword) return alert("Hãy thêm mật khẩu cũ");
      if (newPassword.length < 6) return alert("Mật khẩu phải từ 6 ký tự!");
      if (newPassword !== confirmNewPassword)
        return alert("Mật khẩu xác nhận không khớp!");
      console.log("Cập nhật mật khẩu:", newPassword);
    }
    closeModal();
  };

  useClickOutside(modalTypeRef, !!modalType, closeModal);

  return (
    <div className="bg-white shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto rounded-lg my-10">
      {/* Header */}
      <div className="flex gap-4 items-center mb-8">
        <span className="text-gray-700 text-xl font-medium">
          Cài đặt bảo mật
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8 items-center">
        {/* Avatar */}
        <div className="col-span-1 flex justify-start">
          <img
            className="w-40 h-40 rounded-full object-cover border"
            src={LogoCTUT}
            alt="Avatar"
          />
        </div>

        {/* Thông tin bảo mật */}
        <div className="col-span-2 flex flex-col gap-6 w-full">
          {/* Email */}
          <div
            className="flex justify-between items-center border border-gray-200 px-4 h-16
      rounded-md bg-gray-50 shadow-lg"
          >
            <div>
              <span className="pr-10.5 py-3 border-r border-gray-200">
                Email
              </span>
              <span className="pl-4">{user.email}</span>
            </div>
            <button
              onClick={() => setModalType("email")}
              className="text-2xl hover:bg-gray-200 p-2 rounded-full transition"
            >
              <PiNotePencilLight />
            </button>
          </div>

          {/* Password */}
          <div
            className="flex justify-between items-center border border-gray-200 px-4 py-2 
      rounded-md bg-gray-50 shadow-lg"
          >
            <div>
              <span className="pr-4 py-3 border-r border-gray-200">
                Mật khẩu
              </span>
              <span className="pl-4">• • • • • • • • • •</span>
            </div>

            <button
              onClick={() => setModalType("password")}
              className="text-2xl hover:bg-gray-200 p-2 rounded-full transition"
            >
              <PiNotePencilLight />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalType && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 transition-all">
          <div
            ref={modalTypeRef}
            className="bg-white rounded-lg shadow-lg p-6 w-96 animate-fadeIn"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              {modalType === "email" ? "Chỉnh sửa Email" : "Đổi mật khẩu"}
            </h2>

            {modalType === "email" ? (
              <div className="flex flex-col gap-4">
                <InputComponent
                  label="Email"
                  type="email"
                  placeholder="Nhập email mới..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex gap-4 items-center">
                  <InputComponent label="Code" placeholder="Nhập code..." />
                  <ButtonComponent
                    text="Nhận code"
                    bgColor="bg-white"
                    hoverColor="hover:bg-gray-200"
                    width="w-40"
                    textColor="text-gray-800"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <InputComponent
                  label="Mật khẩu cũ"
                  type="password"
                  placeholder="Nhập mật khẩu cũ..."
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <InputComponent
                  label="Mật khẩu mới"
                  type="password"
                  placeholder="Nhập mật khẩu mới..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <InputComponent
                  label="Xác nhận mật khẩu"
                  type="password"
                  placeholder="Nhập lại mật khẩu..."
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-end mt-8 gap-3">
              <ButtonComponent
                text="Hủy"
                onClick={closeModal}
                bgColor="bg-white"
                textColor="text-gray-800"
                hoverColor="hover:bg-gray-200"
              />
              <ButtonComponent
                text={modalType === "email" ? "Đổi email" : "Đổi mật khẩu"}
                onClick={handleSave}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPage;
