import axios from "axios";

export const heartTarget = async (accessToken, targetId, targetType) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/user/hearts`,
      {
        targetId,
        targetType,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
