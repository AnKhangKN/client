import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoCTUT from "../../../assets/logo/logo-ctut.png";
import InputComponent from "../../../components/shared/InputComponent/InputComponent";
import { BsCameraFill } from "react-icons/bs";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import { IoReturnUpBack } from "react-icons/io5";
import { useSelector } from "react-redux";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [data, setData] = useState({
    lastName: user?.lastName || "",
    firstName: user?.firstName || "",
    userName: user?.userName || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateProfile = () => {
    // const { lastName, firstName, userName, bio } = data;

    try {
      console.log("Cập nhật thông tin thành công!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto rounded-lg my-10">
      <div className="flex items-center gap-4 mb-8">
        <div onClick={() => navigate(-1)} className="text-3xl cursor-pointer">
          <IoReturnUpBack />
        </div>
        <span className="text-gray-700 text-xl font-medium">
          Chỉnh sửa thông tin
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-items-center">
        {/* Avatar */}
        <div className="relative cursor-pointer group">
          <img
            className="w-40 h-40 rounded-full object-cover"
            src={LogoCTUT}
            alt="Avatar"
          />
          <label
            htmlFor="avatar"
            className="absolute -inset-1.5 bg-black/40 rounded-full flex justify-center items-center text-white
            text-3xl opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            <BsCameraFill />
          </label>
          <input id="avatar" type="file" className="hidden" accept="image/*" />
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center gap-6">
            <InputComponent
              id={`lastName`}
              value={`${data.lastName}`}
              onChange={handleChange}
              label="Họ"
              placeholder="Nhập họ..."
            />
            <InputComponent
              id={`firstName`}
              value={`${data.firstName}`}
              onChange={handleChange}
              label="Tên"
              placeholder="Nhập tên..."
            />
          </div>
          <InputComponent
            id={`userName`}
            value={`${data.userName}`}
            onChange={handleChange}
            label="Tên người dùng"
            placeholder="Nhập tên người dùng..."
          />
          <InputComponent
            id={`bio`}
            value={`${data.bio}`}
            onChange={handleChange}
            label="Giới thiệu"
            placeholder="Mô tả bản thân..."
          />

          <div className="m-auto mt-4">
            <ButtonComponent
              onClick={handleUpdateProfile}
              width="w-40"
              text="Cập nhật thông tin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
