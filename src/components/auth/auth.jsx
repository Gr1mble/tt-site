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
      <div className="auth-form">
        <h1 className="auth-title">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        <button onClick={signIn} className="auth-button">
          Sign In
        </button>
        <button onClick={signInWithGoogle} className="auth-button google-btn">
          Sign in with Google
        </button>
        <button
          hidden={!auth?.currentUser}
          onClick={logout}
          className="auth-button logout-btn"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
