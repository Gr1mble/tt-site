import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDMVWG0NjodTDI4jBLEn2XEZUXPhzvIrUE",
  authDomain: "reactfire-8f6df.firebaseapp.com",
  projectId: "reactfire-8f6df",
  storageBucket: "reactfire-8f6df.appspot.com",
  messagingSenderId: "159630719846",
  appId: "1:159630719846:web:5a4736f594611d7c10e6a7",
  measurementId: "G-4TK6P7W9ZE",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
