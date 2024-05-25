import React from "react";
import { auth } from "../../config/firebase";

export const Account = () => {
  const logout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/"; // Redirect to the home page ("/") after successful sign-out
    } catch (err) {
      console.log(err);
    }
  };

  return <button onClick={logout}>Logout</button>;
};
