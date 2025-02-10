import React from "react";
import { signInWithGoogle, logOut, auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login() {
  const [user] = useAuthState(auth);

  return (
    <div className="p-4">
      {user ? (
        <>
          <p>Bienvenue, {user.displayName}</p>
          <button onClick={logOut} className="bg-red-500 p-2 text-white">
            Déconnexion
          </button>
        </>
      ) : (
        <button onClick={signInWithGoogle} className="bg-blue-500 p-2 text-white">
          Se connecter avec Google
        </button>
      )}
    </div>
  );
}