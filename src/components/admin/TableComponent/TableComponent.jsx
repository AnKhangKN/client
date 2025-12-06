import React, { useState } from "react";

const TableComponent = ({ columns = [], dataSource = [], handleOpenModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // mỗi trang 10 dòng

  const totalPages = Math.ceil(dataSource.length / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = dataSource.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      {/* Bảng dữ liệu */}
      <div className="rounded-sm overflow-hidden">
        <table className="w-full border-collapse table-fixed">
          <thead className="bg-gray-600 text-white">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`p-3 text-left font-medium ${
                    col.title === "STT" || col.dataIndex === "role"
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
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  onClick={() => handleOpenModal(row)}
                  className="border-b border-gray-300 hover:bg-blue-50 transition cursor-pointer"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`p-3 text-left font-medium ${
                        col.title === "STT" || col.dataIndex === "role"
                          ? "w-20"
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
                          ? col.render(
                              row[col.dataIndex],
                              row,
                              rowIndex + (currentPage - 1) * pageSize
                            )
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-end space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border ${
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
    </>
  );
};

export default TableComponent;
