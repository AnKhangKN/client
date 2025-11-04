import { io } from "socket.io-client";

// Dùng đúng URL + port server
export const socket = io(`${import.meta.env.VITE_BACKEND_SOCKET}`, {
  transports: ["polling", "websocket"], // fallback khi websocket lỗi
  autoConnect: true,
});
