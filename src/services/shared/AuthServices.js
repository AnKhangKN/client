import axios from "axios";

export const loginService = async (data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/shared/login`,
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
      `${import.meta.env.VITE_BACKEND_API}/shared/token/refresh`,
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
      `${import.meta.env.VITE_BACKEND_API}/shared/register`,
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
      `${import.meta.env.VITE_BACKEND_API}/shared/logout`,
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
