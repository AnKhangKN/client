import React, { useEffect, useState } from "react";
import InputComponent from "../../../components/shared/InputComponent/InputComponent";
import TextAreaComponent from "../../../components/shared/TextareaComponent/TextareaComponent";
import AvatarDefault from "../../../assets/logo/avatar_default.webp";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../../components/shared/ButtonComponent/ButtonComponent";
import * as ValidateToken from "@/utils/token.utils";
import * as UserServices from "@/services/user/UserServices";
import { updateUser } from "@/features/user/userSlice";

const EditPage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    lastName: user.lastName || "",
    firstName: user.firstName || "",
    userName: user.userName || "",
    studentId: user.studentId || "",
    courses: user.courses,
    major: user.major || "",
    gender: user.gender || "",
    bio: user.bio || "",
  });

  useEffect(() => {
    setFormData({
      lastName: user.lastName || "",
      firstName: user.firstName || "",
      userName: user.userName || "",
      studentId: user.studentId || "",
      courses: user.courses,
      major: user.major || "",
      gender: user.gender || "",
      bio: user.bio || "",
    });
  }, [user]);

  const handleUpdateInfoUser = async () => {
    try {
      const accessToken = await ValidateToken.getValidAccessToken();
      const data = { ...formData }; // lấy dữ liệu từ state local

      const res = await UserServices.updateInfoUser(accessToken, data);

      if (res?.status === 200) {
        dispatch(updateUser(res.data));
        alert("Cập nhật thành công!");
      } else if (res?.status === 409) {
        alert(res.message); // userName hoặc studentId trùng
      }
    } catch (error) {
      console.log(error);
      alert("Lỗi server, vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md flex flex-col gap-8">
      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300">
          <img
            className="w-full h-full object-cover"
            src={user.userAvatar ? user.userAvatar : AvatarDefault}
            alt="Avatar"
          />
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <InputComponent
            label="Họ"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
          <InputComponent
            label="Tên"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <InputComponent
            label="Tên người dùng"
            value={formData.userName}
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
            }
          />
          <InputComponent
            label="Mã số sinh viên"
            value={formData.studentId}
            onChange={(e) =>
              setFormData({ ...formData, studentId: e.target.value })
            }
          />
          <InputComponent
            label="Khóa"
            value={formData.courses}
            onChange={(e) =>
              setFormData({ ...formData, courses: e.target.value })
            }
          />
          <InputComponent
            label="Chuyên ngành"
            value={formData.major}
            onChange={(e) =>
              setFormData({ ...formData, major: e.target.value })
            }
          />
        </div>

        {/* Giới tính */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Giới tính</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                checked={formData.gender === "male"}
                onChange={() => setFormData({ ...formData, gender: "male" })}
              />
              Nam
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                checked={formData.gender === "female"}
                onChange={() => setFormData({ ...formData, gender: "female" })}
              />
              Nữ
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                checked={formData.gender === "other"}
                onChange={() => setFormData({ ...formData, gender: "other" })}
              />
              Khác
            </label>
          </div>
        </div>

        {/* Bio */}
        <TextAreaComponent
          label="Tiểu sử"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />

        <div className="flex justify-end">
          <ButtonComponent
            text="Đổi thông tin"
            width="w-40"
            onClick={handleUpdateInfoUser}
          />
        </div>
      </div>
    </div>
  );
};

export default EditPage;
