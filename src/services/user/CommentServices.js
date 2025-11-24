import axios from "axios";

export const addComment = async (accessToken, data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/user/comments`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCommentsByPostId = async (accessToken, postId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/user/comments/posts/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteComment = async (accessToken, commentId) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_API}/user/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
