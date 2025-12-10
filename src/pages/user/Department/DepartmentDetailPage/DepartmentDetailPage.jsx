import React, { useEffect, useState } from "react";
import PostCreateComponent from "../../../../components/user/PostCreateComponent/PostCreateComponent";
import PostComponent from "@/components/user/Post/PostComponent/PostComponent";
import { useLocation } from "react-router-dom";
import * as ValidateToken from "@/utils/token.utils";
import * as PostServices from "@/services/user/PostServices";

const DepartmentDetailPage = () => {
  const location = useLocation();

  const departmentId = location.pathname.split("/")[4];
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPostsDepartment = async () => {
      try {
        const accessToken = await ValidateToken.getValidAccessToken();

        const posts = await PostServices.getPostsDepartmentDetail(
          accessToken,
          departmentId
        );

        setPosts(posts.data);
        console.log(posts.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPostsDepartment();
  }, [departmentId]);

  return (
    <>
      {posts.length === 0 ? (
        <div className="flex justify-center py-4 items-center h-screen">
          Khoa chưa có cập nhật nào
        </div>
      ) : (
        <div className="flex justify-center py-4">
          <div className="w-[620px] flex flex-col space-y-4">
            <PostComponent postsList={posts} />
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentDetailPage;
