import axios from "axios";

export const createChat = async (accessToken, data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/shared/chats`,
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

export const createGroupChat = async (accessToken, data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/shared/groups`,
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

export const sendMessage = async (accessToken, data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/shared/messages`,
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

export const getMessageHistory = async (accessToken, chatId) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/shared/messages/${chatId}`,
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

export const getAllChatList = async (accessToken) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/shared/chats`,
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

export const addNewPasswordChat = async (accessToken, data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/shared/chatPassword`,
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

export const getChatPassword = async (accessToken, chatId) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/shared/chatPassword/${chatId}`,
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

export const verifyChatPassword = async (accessToken, data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/shared/verifyChatPassword`,
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
