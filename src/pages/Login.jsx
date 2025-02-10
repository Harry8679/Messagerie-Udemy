import React from "react";
import { signInWithGoogle, logOut, auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login() {
  const [user] = useAuthState(auth);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        {user ? (
          <>
            <img
              src={user.photoURL}
              alt="Profil"
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <p className="text-xl font-semibold mb-2">Bienvenue, {user.displayName}</p>
            <button
              onClick={logOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Connexion</h2>
            <button
              onClick={signInWithGoogle}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Se connecter avec Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}