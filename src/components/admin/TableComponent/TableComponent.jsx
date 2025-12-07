import React, { useState } from "react";

const TableComponent = ({ columns = [], dataSource = [], handleOpenModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // mỗi trang 8 dòng
  const totalPages = Math.ceil(dataSource.length / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = dataSource.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Lấy giá trị từ row theo dataIndex (string hoặc array)
  const getValue = (row, dataIndex) => {
    if (Array.isArray(dataIndex)) {
      return dataIndex.reduce(
        (acc, key) => (acc != null ? acc[key] : undefined),
        row
      );
    }
    return row[dataIndex];
  };

  // Kiểm tra cột cần width cố định
  const isWideColumn = (dataIndex) =>
    dataIndex === "_id" ||
    dataIndex === "role" ||
    (Array.isArray(dataIndex) && dataIndex.join() === "reportModels,_id");

  return (
    <div className="w-full overflow-x-auto">
      {/* Table */}
      <table className="w-full border-collapse table-auto text-sm">
        <thead className="bg-gray-600 text-white">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`p-3 text-left font-medium ${
                  isWideColumn(col.dataIndex) ? "w-30" : "w-auto"
                }`}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr
                key={row._id || rowIndex}
                onClick={() => handleOpenModal && handleOpenModal(row)}
                className="hover:bg-blue-50 transition cursor-pointer"
              >
                {columns.map((col, colIndex) => {
                  const value = getValue(row, col.dataIndex);

                  // Nếu có render function, dùng render, ngược lại xử lý object
                  const displayValue = col.render
                    ? col.render(
                        value,
                        row,
                        rowIndex + (currentPage - 1) * pageSize
                      )
                    : value && typeof value === "object"
                    ? value.email || value.name || JSON.stringify(value)
                    : value;

                  return (
                    <td
                      key={colIndex}
                      className="p-3 text-gray-700 truncate max-w-[200px]"
                      title={
                        typeof displayValue === "string"
                          ? displayValue
                          : undefined
                      }
                    >
                      {displayValue ?? "-"}
                    </td>
                  );
                })}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-end space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded ${
                page === currentPage
                  ? "bg-gray-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableComponent;
