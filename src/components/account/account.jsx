// eslint-disable-next-line no-unused-vars
import { auth } from "../../config/firebase";
import "./account.css";

export const Account = () => {
  const logout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/"; // Redirect to the home page ("/") after successful sign-out
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid account">
      <button onClick={logout}>Logout</button>
    </div>
  );
};
