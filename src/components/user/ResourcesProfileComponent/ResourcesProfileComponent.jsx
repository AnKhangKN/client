import React from "react";

const ResourcesProfileComponent = () => {
  return (
    <div className="sticky top-4">
      <div
        className="h-[650px] flex flex-col gap-4 py-4 border border-gray-200 rounded-lg overflow-y-auto 
              scrollbar-hide shadow"
      >
        <div>
          <div className="flex items-center justify-between px-4">
            <div className="font-semibold">Documents</div>
            <div className="text-blue-500 cursor-pointer">Xem tất cả</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between px-4">
            <div className="font-semibold">Medias</div>
            <div className="text-blue-500 cursor-pointer">Xem tất cả</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesProfileComponent;
