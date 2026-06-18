import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPz72ZbP-dk_OiEhhF7B46Y34ZANiKZbI",
  authDomain: "skin-app-7ae21.firebaseapp.com",
  projectId: "skin-app-7ae21",
  storageBucket: "skin-app-7ae21.firebasestorage.app",
  messagingSenderId: "167068963000",
  appId: "1:167068963000:web:30e39b33261b8054ff244d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);