import PostComponent from "@/components/user/Post/PostComponent/PostComponent";
import PostCreateComponent from "@/components/user/PostCreateComponent/PostCreateComponent";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as ValidateToken from "@/utils/token.utils";
import * as PostServices from "@/services/user/PostServices";

const FeedPage = () => {
  const user = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const accessToken = await ValidateToken.getValidAccessToken();

        const posts = await PostServices.getPostsDepartment(accessToken);

        setPosts(posts.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto py-4 w-[600px] m-auto">
      {user?.isTeacher && <PostCreateComponent />}

      <div className="flex flex-col space-y-4">
        <PostComponent postsList={posts} />
      </div>
    </div>
  );
};

export default FeedPage;
