import { jwtDecode } from "jwt-decode";
import * as AuthServices from "../services/shared/AuthServices";

export const getValidAccessToken = async () => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    const decoded = jwtDecode(token);

    if (decoded?.exp < Date.now() / 1000) {
      const res = await AuthServices.refreshToken();

      const newToken = res?.accessToken;

      if (newToken) {
        localStorage.setItem("accessToken", newToken);
        return newToken;
      }
      return null;
    }

    return token;
  }

  return null;
};
