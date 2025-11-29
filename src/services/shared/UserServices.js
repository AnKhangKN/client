import axios from "axios";
import * as TokenUtils from "../../utils/token.utils";

export const axiosJWT = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  withCredentials: true,
});

axiosJWT.interceptors.request.use(
  async (config) => {
    const token = await TokenUtils.getValidAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getDetailUser = async (accessToken) => {
  try {
    const res = await axiosJWT.get(
      `${import.meta.env.VITE_BACKEND_API}/shared/profiles`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("❌ getDetailUser error:", error);
    throw error;
  }
};

export const updateUserAvatar = async (accessToken, data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/shared/userAvatar`,
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
  }
};

export const updateUserCover = async (accessToken, data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/shared/userCover`,
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
  }
};
