import React, { useEffect, useState } from "react";
import * as ValidateToken from "@/utils/token.utils";
import * as GroupServices from "@/services/user/GroupServices";
import PostComponent from "@/components/user/Post/PostComponent/PostComponent";
import { useNavigate } from "react-router-dom";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupJoin = async () => {
      try {
        const accessToken = await ValidateToken.getValidAccessToken();

        const res = await GroupServices.getGroupsJoin(accessToken);

        setPosts(res.posts);
        if (!res.posts) {
          navigate("/groups/discover");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchGroupJoin();
  }, [navigate]);

  return (
    <div className="dark:bg-[#1c1c1d] dark:text-white flex justify-center min-h-screen">
      {/* Bài viết */}
      <div className=" w-full max-w-[600px] flex flex-col space-y-4 py-4">
        <PostComponent postsList={posts} />
      </div>
    </div>
  );
};

export default FeedPage;
