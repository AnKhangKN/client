import React from "react";
import { useParams } from "react-router-dom";

const PostManagementDetailPage = () => {
  const { detailName } = useParams();

  return <div>PostManagementDetailPage {detailName}</div>;
};

export default PostManagementDetailPage;
