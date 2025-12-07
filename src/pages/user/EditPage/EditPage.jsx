import React from "react";
import InputComponent from "../../../components/shared/InputComponent/InputComponent";
import TextAreaComponent from "../../../components/shared/TextareaComponent/TextareaComponent";
import logoCTUT from "../../../assets/logo/logo-ctut.png";
import { useSelector } from "react-redux";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";

const EditPage = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md flex flex-col gap-8">
      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300">
          <img
            className="w-full h-full object-cover"
            src={user.userAvatar ? user.userAvatar : logoCTUT}
            alt="Avatar"
          />
        </div>
        <ButtonComponent text="Thay ảnh" width="w-40" />
      </div>

      {/* Form */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <InputComponent label="Họ" value={user.lastName} />
          <InputComponent label="Tên" value={user.firstName} />
          <InputComponent label="Tên người dùng" value={user.userName} />
          <InputComponent label="Mã số sinh viên" value={user.studentId} />
          <InputComponent label="Khóa" value={user.courses} />
          <InputComponent label="Chuyên ngành" value={user.major} />
        </div>

        {/* Giới tính */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Giới tính</label>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <input type="radio" name="gender" id="male" />
              <label htmlFor="male">Nam</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" name="gender" id="female" />
              <label htmlFor="female">Nữ</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" name="gender" id="other" />
              <label htmlFor="other">Khác</label>
            </div>
          </div>
        </div>

        {/* Tiểu sử */}
        <TextAreaComponent label="Tiểu sử" value={user.bio} />

        {/* Mạng xã hội */}
        <div className="font-medium text-gray-700">Mạng xã hội</div>

        <div className="flex justify-end">
          <ButtonComponent text="Đổi thông tin" width="w-40" />
        </div>
      </div>
    </div>
  );
};

export default EditPage;
