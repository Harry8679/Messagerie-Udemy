import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Remplace par ta propre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBIJn1e3WcfUAWQw4MmyPhMS8P7dmZJgHs",
  authDomain: "messagerie-app-aefa9.firebaseapp.com",
  projectId: "messagerie-app-aefa9",
  storageBucket: "messagerie-app-aefa9.firebasestorage.app",
  messagingSenderId: "398587142916",
  appId: "1:398587142916:web:29db781c617fe429d5a651",
  measurementId: "G-Y6HE3TJS08"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 🔹 Fonction pour se connecter avec Google
const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Erreur lors de la connexion avec Google:", error);
  }
};

// 🔹 Fonction pour se déconnecter
const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
};

// 🔹 Exporte les fonctions et variables nécessaires
export { db, auth, googleProvider, signInWithGoogle, logOut };