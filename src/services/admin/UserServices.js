import axios from "axios";

export const getUsers = async (accessToken) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/admin/users`,
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

export const updateRole = async (accessToken, userId, role) => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_API}/admin/users/${userId}`,
      { role },
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
