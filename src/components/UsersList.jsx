import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify"; // Optionnel pour afficher les notifications

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    // Récupérer la liste des utilisateurs depuis Firestore
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setFriendRequests(docSnap.data().friendRequests || []);
        }
      });

      return () => unsubscribe();
    }
  }, [auth.currentUser]);

  const sendFriendRequest = async (friendId) => {
    if (!auth.currentUser) return;

    const friendRef = doc(db, "users", friendId);
    const friendDoc = await getDoc(friendRef);

    if (friendDoc.exists()) {
      const friendData = friendDoc.data();
      if (friendData.friendRequests && friendData.friendRequests.includes(auth.currentUser.uid)) {
        toast.warn("Vous avez déjà envoyé une demande à cet utilisateur.");
        return;
      }

      await updateDoc(friendRef, {
        friendRequests: [...(friendData.friendRequests || []), auth.currentUser.uid],
      });

      toast.success("Demande d'ami envoyée !");
    }
  };

  const acceptFriendRequest = async (friendId) => {
    if (!auth.currentUser) return;

    const currentUserRef = doc(db, "users", auth.currentUser.uid);
    const friendRef = doc(db, "users", friendId);

    // Récupérer les données de l'utilisateur actuel et de l'ami
    const currentUserDoc = await getDoc(currentUserRef);
    const friendDoc = await getDoc(friendRef);

    if (currentUserDoc.exists() && friendDoc.exists()) {
      const currentUserData = currentUserDoc.data();
      const friendData = friendDoc.data();

      await updateDoc(currentUserRef, {
        friends: [...(currentUserData.friends || []), friendId],
        friendRequests: (currentUserData.friendRequests || []).filter((id) => id !== friendId),
      });

      await updateDoc(friendRef, {
        friends: [...(friendData.friends || []), auth.currentUser.uid],
      });

      toast.success("Ami ajouté avec succès !");
    }
  };

  return (
    <div className="p-4 border-r w-1/4 bg-white shadow-md">
      <h3 className="text-lg font-bold mb-4">Utilisateurs</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex items-center gap-2 p-2 border-b">
            <img src={user.photoURL} alt={user.name} className="w-10 h-10 rounded-full" />
            <span>{user.name}</span>
            {user.online ? (
              <span className="text-green-500">● En ligne</span>
            ) : (
              <span className="text-gray-400">● Hors ligne</span>
            )}
            {auth.currentUser && user.id !== auth.currentUser.uid && !user.friends?.includes(auth.currentUser.uid) && (
              <button
                onClick={() => sendFriendRequest(user.id)}
                className="ml-auto bg-blue-500 text-white p-1 rounded text-sm"
              >
                Ajouter
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Demandes d'ami reçues */}
      <h3 className="text-lg font-bold mt-6">Demandes d'ami</h3>
      <ul>
        {friendRequests.map((friendId) => {
          const friend = users.find((u) => u.id === friendId);
          return (
            friend && (
              <li key={friend.id} className="flex items-center gap-2 p-2 border-b">
                <img src={friend.photoURL} alt={friend.name} className="w-10 h-10 rounded-full" />
                <span>{friend.name}</span>
                <button
                  onClick={() => acceptFriendRequest(friend.id)}
                  className="ml-auto bg-green-500 text-white p-1 rounded text-sm"
                >
                  Accepter
                </button>
              </li>
            )
          );
        })}
      </ul>
    </div>
  );
}