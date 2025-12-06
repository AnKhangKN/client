import axios from "axios";

export const createReport = async (accessToken, data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/shared/reports`,
      data,
      {
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
