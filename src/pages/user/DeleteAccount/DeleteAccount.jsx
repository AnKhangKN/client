import React, { useState } from "react";

const DeleteAccount = () => {
  const [confirm, setConfirm] = useState(false);

  const handleDelete = () => {
    if (confirm) {
      // Xử lý xóa tài khoản ở đây
      alert("Tài khoản của bạn đã được xóa.");
    } else {
      alert("Vui lòng xác nhận trước khi xóa tài khoản.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow border border-red-200">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          Xóa tài khoản
        </h2>
        <p className="text-gray-700 mb-4">
          Khi xóa tài khoản, tất cả dữ liệu của bạn sẽ bị mất vĩnh viễn. Hãy
          chắc chắn rằng bạn muốn thực hiện thao tác này.
        </p>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="confirmDelete"
            checked={confirm}
            onChange={(e) => setConfirm(e.target.checked)}
            className="mr-2 w-4 h-4"
          />
          <label htmlFor="confirmDelete" className="text-gray-700">
            Tôi hiểu và muốn xóa tài khoản
          </label>
        </div>

        <button
          onClick={handleDelete}
          className={`w-full py-2 rounded-lg text-white font-semibold transition-all ${
            confirm
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-300 cursor-not-allowed"
          }`}
          disabled={!confirm}
        >
          Xóa tài khoản
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;
