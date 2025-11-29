import React from "react";
import { useNavigate } from "react-router-dom";

const SidebarPostComponent = () => {
  const navigate = useNavigate();
  const listPostsDetail = [
    { label: "Bài viết của người dùng", detailName: "users" },
    { label: "Bài viết của groups", detailName: "groups" },
    {
      label: "Bài viết của khoa",
      detailName: "departments",
    },
  ];

  return (
    <div className="border-r border-gray-200 h-screen">
      <div>
        <div
          className="cursor-pointer"
          onClick={() => navigate("/admin/posts")}
        >
          Tổng quan
        </div>

        <div>
          {listPostsDetail.map((detail, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/admin/posts/${detail.detailName}`)}
              className="cursor-pointer"
            >
              {detail.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarPostComponent;
