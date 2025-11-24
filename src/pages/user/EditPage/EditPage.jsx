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

        <TextAreaComponent label="Tiểu sử" value={user.bio} />

        <ButtonComponent text="Đổi thông tin" />
      </div>
    </div>
  );
};

export default EditPage;
