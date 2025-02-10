import { useState, useEffect } from "react";
import socket from "../socket";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    // Récupérer les messages en temps réel depuis Firebase Firestore
    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Écouter les nouveaux messages via WebSockets
    socket.on("receive_message", (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      unsubscribe();
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      text: newMessage,
      senderId: user.uid,
      senderName: user.displayName,
      timestamp: serverTimestamp()
    };

    // Enregistrer dans Firebase
    await addDoc(collection(db, "messages"), messageData);

    // Envoyer le message via WebSocket
    socket.emit("send_message", messageData);

    setNewMessage("");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="h-64 overflow-y-auto border p-4 mb-4 bg-white rounded-lg">
        {messages.map((msg) => (
          <p key={msg.id} className={`p-2 ${msg.senderId === user.uid ? "text-right" : "text-left"}`}>
            <strong>{msg.senderName}: </strong>{msg.text}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border p-2 w-full"
        />
        <button onClick={sendMessage} className="bg-green-500 p-2 text-white rounded">
          Envoyer
        </button>
      </div>
    </div>
  );
}