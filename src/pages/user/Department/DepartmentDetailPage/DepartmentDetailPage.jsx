import React from "react";
import PostCreateComponent from "../../../../components/user/PostCreateComponent/PostCreateComponent";

const DepartmentDetailPage = () => {
  return (
    <div className="flex justify-center py-6">
      <div className="w-[600px]">
        <div>
          <PostCreateComponent />
        </div>

        <div>content</div>
      </div>
    </div>
  );
};

export default DepartmentDetailPage;
