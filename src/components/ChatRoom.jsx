import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName,
      timestamp: serverTimestamp()
    });
    setNewMessage("");
  };

  return (
    <div className="p-4">
      <div className="h-64 overflow-y-auto">
        {messages.map((msg) => (
          <p key={msg.id} className={`p-2 ${msg.senderId === auth.currentUser.uid ? "text-right" : "text-left"}`}>
            <strong>{msg.senderName}: </strong>{msg.text}
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
        <button onClick={sendMessage} className="bg-green-500 p-2 text-white">Envoyer</button>
      </div>
    </div>
  );
}