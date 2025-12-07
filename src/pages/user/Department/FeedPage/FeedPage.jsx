import PostCreateComponent from "@/components/user/PostCreateComponent/PostCreateComponent";
import React from "react";
import { useSelector } from "react-redux";

const FeedPage = () => {
  const user = useSelector((state) => state.user);

  console.log(user);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {user?.isTeacher && <PostCreateComponent />}
    </div>
  );
};

export default FeedPage;
