import React, { useState } from "react";
import TableComponent from "@/components/admin/TableComponent/TableComponent";
import ButtonComponent from "@/components/shared/ButtonComponent/ButtonComponent";
import InputComponent from "@/components/shared/InputComponent/InputComponent";

const DepartmentManagementPage = () => {
  const [departments, setDepartments] = useState([
    {
      _id: "1",
      departmentName: "Công nghệ thông tin",
      departmentAvatar: "https://i.pravatar.cc/40?img=1",
    },
    {
      _id: "2",
      departmentName: "Hệ thống thông tin",
      departmentAvatar: "https://i.pravatar.cc/40?img=2",
    },
    {
      _id: "3",
      departmentName: "Khoa học dữ liệu",
      departmentAvatar: "https://i.pravatar.cc/40?img=3",
    },
    {
      _id: "4",
      departmentName: "Mạng và an ninh",
      departmentAvatar: "https://i.pravatar.cc/40?img=4",
    },
  ]);

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAddNewDepartment, setModalAddNewDepartment] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Tên khoa", dataIndex: "departmentName", key: "departmentName" },
    {
      title: "Avatar",
      dataIndex: "departmentAvatar",
      key: "departmentAvatar",
      render: (avatar) => (
        <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
      ),
    },
  ];

  const handleRowClick = (record) => {
    setSelectedDepartment(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDepartment(null);
    setIsModalOpen(false);
  };

  // Khi chọn file avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file)); // tạo URL preview
    }
  };

  const handleAddDepartment = () => {
    if (!newDepartmentName.trim()) return;

    const newDepartment = {
      _id: (departments.length + 1).toString(),
      departmentName: newDepartmentName,
      // nếu có avatar mới, dùng URL preview; nếu không, dùng mặc định
      departmentAvatar: avatarPreview || "https://i.pravatar.cc/40?img=5",
    };
    setDepartments([...departments, newDepartment]);

    // reset form
    setNewDepartmentName("");
    setAvatarPreview(null);
    setModalAddNewDepartment(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Quản lý khoa</h2>
        <ButtonComponent
          text="Thêm mới"
          width="w-40"
          onClick={() => setModalAddNewDepartment(true)}
        />
      </div>

      {/* Modal thêm mới khoa */}
      {modalAddNewDepartment && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Thêm khoa mới</h3>
              <button
                onClick={() => setModalAddNewDepartment(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              <div>
                <label className="block mb-2 font-medium">Avatar khoa</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Preview ảnh */}
              {avatarPreview && (
                <div className="mb-2">
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full border"
                  />
                </div>
              )}

              <InputComponent
                label="Tên khoa"
                placeholder="Nhập tên khoa"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
              />

              <ButtonComponent
                text="Thêm"
                width="w-full"
                onClick={handleAddDepartment}
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <TableComponent
        columns={columns}
        dataSource={departments}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          className: "cursor-pointer hover:bg-gray-100",
        })}
      />

      {/* Modal chi tiết */}
      {isModalOpen && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4">Chi tiết khoa</h3>
            <div className="mb-2">
              <strong>ID:</strong> {selectedDepartment._id}
            </div>
            <div className="mb-2">
              <strong>Tên khoa:</strong> {selectedDepartment.departmentName}
            </div>
            <div className="mb-4">
              <strong>Avatar:</strong>
              <img
                src={selectedDepartment.departmentAvatar}
                alt="Avatar"
                className="w-16 h-16 rounded-full ml-2"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <ButtonComponent
                text="Đóng"
                onClick={handleCloseModal}
                width="w-24"
              />
              <ButtonComponent
                text="Xóa"
                width="w-24"
                onClick={() => {
                  setDepartments(
                    departments.filter((d) => d._id !== selectedDepartment._id)
                  );
                  handleCloseModal();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagementPage;
