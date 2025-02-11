import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      if (!snapshot.empty) {
        setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } else {
        console.log("Aucun utilisateur trouvé dans Firestore.");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 border-r w-1/4 bg-white shadow-md">
      <h3 className="text-lg font-bold mb-4">Utilisateurs en ligne</h3>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id} className="flex items-center gap-2 p-2 border-b">
              <img src={user.photoURL} alt={user.name} className="w-10 h-10 rounded-full" />
              <span>{user.name}</span>
              {user.online ? (
                <span className="text-green-500">● En ligne</span>
              ) : (
                <span className="text-gray-400">● Hors ligne</span>
              )}
            </li>
          ))
        ) : (
          <p>Aucun utilisateur trouvé</p>
        )}
      </ul>
    </div>
  );
}
