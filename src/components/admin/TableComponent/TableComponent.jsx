import React, { useState } from "react";
import ButtonComponent from "../../shared/ButtonComponent/ButtonComponent";

const TableComponent = ({ columns = [], dataSource = [] }) => {
  const [isModal, setIsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenModal = (record) => {
    setSelectedUser(record);
    setIsModal(true);
  };

  const handleCloseModal = () => {
    setIsModal(false);
    setSelectedUser(null);
  };

  return (
    <>
      {/* Bảng dữ liệu */}
      <div>
        <table className="w-full border-collapse table-fixed">
          <thead className="bg-gray-600 text-white">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`p-3 text-left font-medium ${
                    col.dataIndex === "_id" || col.dataIndex === "isTeacher"
                      ? "w-40"
                      : "w-auto"
                  }`}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {dataSource.length > 0 ? (
              dataSource.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  onClick={() => handleOpenModal(row)}
                  className="border-b border-gray-300 hover:bg-blue-50 transition cursor-pointer"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`p-3 text-gray-800 ${
                        col.dataIndex === "_id" || col.dataIndex === "isTeacher"
                          ? "w-40"
                          : "w-auto"
                      }`}
                    >
                      <div
                        className="truncate overflow-hidden whitespace-nowrap"
                        title={
                          row[col.dataIndex]
                            ? String(row[col.dataIndex])
                            : undefined
                        }
                      >
                        {col.render
                          ? col.render(row[col.dataIndex], row)
                          : row[col.dataIndex]}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-4 text-center text-gray-500 italic"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-end gap-2 mt-4">
          <div className="bg-gray-600 px-3 py-1 text-white rounded-sm">1</div>
          <div className="bg-gray-600 px-3 py-1 text-white rounded-sm">2</div>
          <div className="bg-gray-600 px-3 py-1 text-white rounded-sm">3</div>
        </div>
      </div>

      {/* Modal chi tiết */}
      {isModal && selectedUser && (
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

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Cấp bậc:</span>
                <span
                  className={`px-2 py-1 text-sm rounded-md ${
                    selectedUser.isTeacher
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedUser.isTeacher ? "Giảng viên" : "Sinh viên"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Quyền:</span>
                <div>{selectedUser.isAdmin ? "Admin" : "Người dùng"}</div>
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

              <ButtonComponent text={`Cấp quyền`} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableComponent;
