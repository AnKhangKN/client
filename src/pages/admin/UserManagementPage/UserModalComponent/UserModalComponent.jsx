import React, { useState } from "react";
import ButtonComponent from "@/components/shared/ButtonComponent/ButtonComponent";
import * as UserServices from "@/services/admin/UserServices";
import * as TokenUtils from "@/utils/token.utils";

const UserModalComponent = ({ selectedUser, handleCloseModal, setUser }) => {
  const [loading, setLoading] = useState(false);

  const [selectedRole, setSelectedRole] = useState(
    selectedUser
      ? selectedUser.isAdmin
        ? "isAdmin"
        : selectedUser.isTeacher
        ? "isTeacher"
        : "isStudent"
      : ""
  );

  const updateRole = async () => {
    setLoading(true);
    try {
      const accessToken = await TokenUtils.getValidAccessToken();

      await UserServices.updateRole(
        accessToken,
        selectedUser._id,
        selectedRole
      );

      // Cập nhật local state để bảng tự động render quyền mới
      setUser((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id
            ? {
                ...u,
                isAdmin: selectedRole === "isAdmin",
                isTeacher: selectedRole === "isTeacher",
              }
            : u
        )
      );

      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={handleCloseModal} // click ngoài modal để đóng
        >
          <div
            className="bg-white p-6 rounded-lg w-[400px] shadow-lg"
            onClick={(e) => e.stopPropagation()} // ngăn việc click trong modal bị đóng
          >
            <h2 className="text-lg font-semibold mb-4">Thông tin chi tiết</h2>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Họ và Tên:</span>
                <span>
                  {selectedUser.lastName} {selectedUser.firstName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Email:</span>
                <span>{selectedUser.email}</span>
              </div>

              {!selectedUser.isAdmin && !selectedUser.isTeacher && (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Cấp quyền:</span>

                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="">--- Lựa chọn quyền ---</option>
                    <option value="isAdmin">Admin</option>
                    <option value="isTeacher">Giảng viên</option>

                    <option value="isStudent">Sinh viên</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Quyền:</span>
                <div>
                  {selectedUser.isAdmin
                    ? "Admin"
                    : selectedUser.isTeacher
                    ? "Giảng viên"
                    : "Sinh viên"}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-between items-center gap-4">
              <ButtonComponent
                text={`Đóng`}
                onClick={handleCloseModal}
                bgColor="white"
                hoverColor="hover:bg-gray-200"
                textColor="text-gray-800"
              />

              {!selectedUser.isAdmin && !selectedUser.isTeacher && (
                <ButtonComponent
                  text={`Cấp quyền`}
                  loading={loading}
                  onClick={updateRole}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserModalComponent;
