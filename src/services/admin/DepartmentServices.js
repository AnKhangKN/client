import axios from "axios";

export const getDepartments = async (accessToken) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/admin/departments`,
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

export const createDepartment = async (accessToken, data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/admin/departments`,
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
