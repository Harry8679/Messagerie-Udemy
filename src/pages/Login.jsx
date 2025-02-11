import React, { useEffect, useState } from "react";
import { auth, googleProvider, db } from "../firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:6500");

export default function Login() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Ajouter l'utilisateur à Firestore et marquer en ligne
        const userRef = doc(db, "users", currentUser.uid);
        setDoc(userRef, {
          name: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          online: true,
        }, { merge: true });

        socket.emit("user_connected", {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Ajouter l'utilisateur à Firestore s'il n'existe pas
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        online: true,
      }, { merge: true });

      socket.emit("user_connected", {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    } catch (error) {
      console.error("Erreur d'authentification :", error);
    }
  };

  const logOut = async () => {
    if (user) {
      await updateDoc(doc(db, "users", user.uid), { online: false });
      await signOut(auth);
      socket.disconnect();
      setUser(null);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        {user ? (
          <>
            <img src={user.photoURL} alt="Avatar" className="w-20 h-20 rounded-full mx-auto" />
            <p className="mt-2">Bienvenue, {user.displayName}</p>
            <button onClick={logOut} className="bg-red-500 p-2 text-white rounded mt-4">
              Déconnexion
            </button>
            <button onClick={() => navigate("/chat")} className="bg-green-500 p-2 text-white rounded mt-4">
              Aller au Chat
            </button>
          </>
        ) : (
          <button onClick={signInWithGoogle} className="bg-blue-500 p-2 text-white rounded">
            Se connecter avec Google
          </button>
        )}
      </div>
    </div>
  );
}