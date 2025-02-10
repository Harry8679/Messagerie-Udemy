import { useState, useEffect } from "react";
import socket from "../socket";

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("update_users", (onlineUsers) => {
      setUsers(onlineUsers);
    });

    return () => {
      socket.off("update_users");
    };
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Utilisateurs connectés</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span> {user}
          </li>
        ))}
      </ul>
    </div>
  );
}