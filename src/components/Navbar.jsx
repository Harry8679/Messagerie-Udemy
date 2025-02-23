import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (user) {
      await signOut(auth);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-xl">Messagerie App</h1>
      <div>
        <Link to="/" className="px-4">Accueil</Link>
        <Link to="/chat" className="px-4">Chat</Link>
        {user ? (
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
            Déconnexion
          </button>
        ) : (
          <Link to="/" className="bg-blue-500 px-4 py-2 rounded">
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
}