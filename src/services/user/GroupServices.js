import axios from "axios";

export const createGroup = async (accessToken, data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/user/groups`,
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

export const getGroupsJoin = async (accessToken) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/user/groups`,
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

export const getGroupDetail = async (accessToken, groupId) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/user/groups/${groupId}`,
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

export const getGroupsNotJoined = async (accessToken) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/user/groups/notJoin`,
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
