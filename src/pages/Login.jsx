import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";

export default function Login() {
  const signIn = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="p-4">
      {auth.currentUser ? (
        <div>
          <p>Bienvenue, {auth.currentUser.displayName}</p>
          <button onClick={logout} className="bg-red-500 p-2 text-white">Déconnexion</button>
        </div>
      ) : (
        <button onClick={signIn} className="bg-blue-500 p-2 text-white">Se connecter avec Google</button>
      )}
    </div>
  );
}