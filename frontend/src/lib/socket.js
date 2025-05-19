import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "/";

export const socket = io(BASE_URL, {
  withCredentials: true,
  autoConnect: false, // socket bağlantısını manuel başlatacağız
});
