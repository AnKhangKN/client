import React, { useEffect, useState } from "react";
import TableComponent from "@/components/admin/TableComponent/TableComponent";
import ButtonComponent from "@/components/shared/ButtonComponent/ButtonComponent";
import InputComponent from "@/components/shared/InputComponent/InputComponent";
import * as DepartmentServices from "@/services/admin/DepartmentServices";
import * as TokenUtils from "@/utils/token.utils";

const DepartmentManagementPage = () => {
  const [departments, setDepartments] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [modalAddNewDepartment, setModalAddNewDepartment] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentCode, setNewDepartmentCode] = useState("");

  useEffect(() => {
    fetchDepartment();
  }, []);

  const fetchDepartment = async () => {
    try {
      const accessToken = await TokenUtils.getValidAccessToken();
      const res = await DepartmentServices.getDepartments(accessToken);
      setDepartments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "STT", render: (_, __, index) => index + 1 },
    { title: "Tên khoa", dataIndex: "departmentName" },
    { title: "Code", dataIndex: "departmentCode" },
  ];

  const handleOpenModal = (record) => {
    setSelectedDepartment(record);

    setNewDepartmentName(record.departmentName);
    setNewDepartmentCode(record.departmentCode);
  };

  const handleCloseModal = () => {
    setSelectedDepartment(null);
    setNewDepartmentName("");
    setNewDepartmentCode("");
  };

  const handleAddDepartment = async () => {
    try {
      if (!newDepartmentName.trim() || !newDepartmentCode.trim()) return;

      const accessToken = await TokenUtils.getValidAccessToken();

      const payload = {
        departmentName: newDepartmentName,
        departmentCode: newDepartmentCode,
      };

      const res = await DepartmentServices.createDepartment(
        accessToken,
        payload
      );

      setDepartments((prev) => [res.data, ...prev]);

      setNewDepartmentName("");
      setNewDepartmentCode("");
      setModalAddNewDepartment(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateDepartment = async () => {
    try {
      const accessToken = await TokenUtils.getValidAccessToken();

      const updated = {
        departmentName: newDepartmentName,
        departmentCode: newDepartmentCode,
      };

      await DepartmentServices.updateDepartment(accessToken, {
        departmentId: selectedDepartment._id,
        ...updated,
      });

      setDepartments((prev) =>
        prev.map((dep) =>
          dep._id === selectedDepartment._id ? { ...dep, ...updated } : dep
        )
      );

      handleCloseModal();
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
          onClick={() => {
            setNewDepartmentName("");
            setNewDepartmentCode("");
            setModalAddNewDepartment(true);
          }}
        />
      </div>

      {/* Modal thêm mới */}
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
        handleOpenModal={handleOpenModal}
      />

      {/* Modal cập nhật */}
      {selectedDepartment && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4">Chi tiết khoa</h3>

            <div className="space-y-4">
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
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <ButtonComponent
                text="Đóng"
                bgColor="bg-white"
                textColor="text-gray-800"
                hoverColor="hover:bg-gray-200"
                width="w-24"
                onClick={handleCloseModal}
              />
              <ButtonComponent
                text="Cập nhật"
                width="w-24"
                onClick={handleUpdateDepartment}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagementPage;
