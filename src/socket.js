import { io } from "socket.io-client";

const socket = io("http://localhost:6500"); // URL de ton backend Socket.io
export default socket;
