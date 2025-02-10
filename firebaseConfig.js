import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIJn1e3WcfUAWQw4MmyPhMS8P7dmZJgHs",
  authDomain: "messagerie-app-aefa9.firebaseapp.com",
  projectId: "messagerie-app-aefa9",
  storageBucket: "messagerie-app-aefa9.firebasestorage.app",
  messagingSenderId: "398587142916",
  appId: "1:398587142916:web:29db781c617fe429d5a651",
  measurementId: "G-Y6HE3TJS08"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
