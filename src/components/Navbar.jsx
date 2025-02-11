
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Navbar() {
  const handleLogout = async () => {
    if (auth.currentUser) {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { online: false });
      await signOut(auth);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between text-white">
      <Link to="/" className="text-lg">Accueil</Link>
      {auth.currentUser && (
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
          Déconnexion
        </button>
      )}
    </nav>
  );
}
