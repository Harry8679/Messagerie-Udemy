import React from "react";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:6500");

export default function Login() {
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate(); // Permet de rediriger l'utilisateur

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      socket.emit("user_connected", result.user.displayName);
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = async () => {
    await signOut(auth);
    socket.disconnect();
    setUser(null);
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