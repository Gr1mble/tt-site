import { useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import "./auth.css";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = "/"; // Redirect to the home page ("/") after successful sign-in
    } catch (err) {
      console.log(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      window.location.href = "/"; // Redirect to the home page ("/") after successful sign-in
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/"; // Redirect to the home page ("/") after successful sign-in
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid auth">
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <button onClick={signIn}>Sign In</button>

      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <p style={{ color: auth?.currentUser?.uid ? "green" : "red" }}>
        {auth?.currentUser?.email}
      </p>
      <button hidden={!auth?.currentUser} onClick={logout}>
        Logout
      </button>
    </div>
  );
};
