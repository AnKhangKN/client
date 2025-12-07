import axios from "axios";

export const getDashboard = async (accessToken) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/admin/dashboards`,
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
