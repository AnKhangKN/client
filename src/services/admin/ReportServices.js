import axios from "axios";

export const getReports = async (accessToken, reportType) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/admin/reports/${reportType}`,
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

export const confirmReport = async (accessToken, data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/admin/reports`,
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

export const cancelReport = async (accessToken, data) => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_API}/admin/reports`,
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
