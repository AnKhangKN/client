import axios from "axios";

export const searchUserAndGroup = async (keyword, accessToken) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/shared/search`,
      {
        params: { keyword }, // gửi keyword dưới dạng query string
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
