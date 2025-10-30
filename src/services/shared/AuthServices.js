import axios from "axios";

export const loginService = async (data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/auth/login`,
      data,
      {
        withCredentials: true,
      }
    );

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/auth/token/refresh`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const registerService = async (data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/auth/register`,
      data
    );

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logoutServices = async (accessToken) => {
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_BACKEND_API}/auth/logout`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
