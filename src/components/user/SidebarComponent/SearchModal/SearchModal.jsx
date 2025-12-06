import React from "react";
import { MdOutlineClose } from "react-icons/md";

const SearchModal = ({ closeSearchModal, searchRef }) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-start items-center z-50">
      <div
        ref={searchRef}
        className="bg-white h-full w-[600px] shadow-lg p-6 animate-slide-in-left"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-semibold text-gray-800">Tìm kiếm</div>

          {/* Nút đóng */}
          <button
            onClick={closeSearchModal}
            className="flex justify-center items-center cursor-pointer text-xl text-gray-500 hover:text-black"
          >
            <MdOutlineClose />
          </button>
        </div>

        <input
          type="text"
          placeholder="Nhập nội dung tìm kiếm..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
        />

        <div className="mt-4 text-gray-500 text-sm">
          Gợi ý tìm kiếm sẽ hiển thị tại đây...
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
