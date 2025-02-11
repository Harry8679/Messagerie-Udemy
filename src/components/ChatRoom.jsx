import { useState, useEffect } from "react";
import io from "socket.io-client";
import { auth } from "../firebaseConfig";
import UsersList from "./UsersList";

const socket = io("http://localhost:6500");

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    if (auth.currentUser) {
      socket.emit("user_connected", auth.currentUser.displayName);
    }

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("update_users", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("send_message", {
        text: newMessage,
        sender: auth.currentUser.displayName,
      });
      setNewMessage("");
    }
  };

  return (
    <div className="p-4 flex gap-4">
      {/* <div className="w-1/4 border-r p-4">
        <h3 className="text-lg font-bold">Utilisateurs connectés</h3>
        <ul>
          {Object.values(onlineUsers).map((user, index) => (
            <li key={index} className="text-green-500">
              ● {user}
            </li>
          ))}
        </ul>
      </div> */}
      <UsersList />

      <div className="w-3/4">
        <div className="h-64 overflow-y-auto border p-4">
          {messages.map((msg, index) => (
            <p key={index} className="p-2">
              <strong>{msg.sender}: </strong>{msg.text}
            </p>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="border p-2 w-full"
          />
          <button onClick={sendMessage} className="bg-green-500 p-2 text-white">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}