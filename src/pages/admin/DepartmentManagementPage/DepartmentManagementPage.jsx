import React, { useEffect, useState } from "react";
import TableComponent from "@/components/admin/TableComponent/TableComponent";
import ButtonComponent from "@/components/shared/ButtonComponent/ButtonComponent";
import InputComponent from "@/components/shared/InputComponent/InputComponent";
import * as DepartmentServices from "@/services/admin/DepartmentServices";
import * as TokenUtils from "@/utils/token.utils";

const DepartmentManagementPage = () => {
  const [departments, setDepartments] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAddNewDepartment, setModalAddNewDepartment] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentCode, setNewDepartmentCode] = useState("");

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const accessToken = await TokenUtils.getValidAccessToken();

        const res = await DepartmentServices.getDepartments(accessToken);
        setDepartments(res.data);

        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDepartment();
  }, []);

  const columns = [
    { title: "STT", render: (_, __, index) => index + 1 },
    { title: "Tên khoa", dataIndex: "departmentName", key: "departmentName" },
    { title: "Code", dataIndex: "departmentCode" },
  ];

  const handleRowClick = (record) => {
    setSelectedDepartment(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDepartment(null);
    setIsModalOpen(false);
  };

  const handleAddDepartment = async () => {
    try {
      if (!newDepartmentName.trim()) return;
      if (!newDepartmentCode.trim()) return;

      const newDepartment = {
        departmentName: newDepartmentName,
        departmentCode: newDepartmentCode,
      };
      const accessToken = await TokenUtils.getValidAccessToken();

      await DepartmentServices.createDepartment(accessToken, newDepartment);

      setDepartments([newDepartment, ...departments]);

      // reset form
      setNewDepartmentName("");
      setNewDepartmentCode("");
      setModalAddNewDepartment(false);
    } catch (error) {
      console.log(error);
    }
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
              <InputComponent
                label="Tên khoa"
                placeholder="Nhập tên khoa"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
              />
              <InputComponent
                label="Mã khoa"
                placeholder="Nhập mã khoa"
                value={newDepartmentCode}
                onChange={(e) => setNewDepartmentCode(e.target.value)}
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
