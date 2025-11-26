import React from "react";
import InputComponent from "../../../components/shared/InputComponent/InputComponent";
import TextAreaComponent from "../../../components/shared/TextareaComponent/TextareaComponent";
import logoCTUT from "../../../assets/logo/logo-ctut.png";
import { useSelector } from "react-redux";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";

const EditPage = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="w-20 h-20 overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={user.userAvatar ? user.userAvatar : logoCTUT}
            alt=""
          />
        </div>

        <ButtonComponent text="Thay ảnh" width="w-40" />
      </div>

      <div className="flex flex-col gap-4">
        <InputComponent label="Họ" value={user.lastName} />
        <InputComponent label="Tên" value={user.firstName} />
        <InputComponent label="Tên người dùng" value={user.userName} />
        <div>
          <div>
            <input type="radio" name="" id="" /> <label htmlFor="">Nam</label>
          </div>

          <div>
            <input type="radio" name="" id="" /> <label htmlFor="">Nữ</label>
          </div>

          <div>
            <input type="radio" name="" id="" /> <label htmlFor="">Khác</label>
          </div>
        </div>
        <InputComponent label="Mã số sinh viên" value={user.studentId} />
        <InputComponent label="Khóa" value={user.courses} />
        <InputComponent label="Chuyên ngành" value={user.major} />

        <TextAreaComponent label="Tiểu sử" value={user.bio} />

        <div>Mạng xã hội</div>

        <ButtonComponent text="Đổi thông tin" />
      </div>
    </div>
  );
};

export default EditPage;
