import React, { useState } from "react";
import "./gameSigns.css";
import { db } from "../../../config/firebase";
import { collection, addDoc } from "firebase/firestore";

export const GameSigns = () => {
  const [dartsNew, setDartsNew] = useState("");
  const [euchreNew, setEuchreNew] = useState("");
  const [horseshoesNew, setHorseshoesNew] = useState("");
  const [pokerNew, setPokerNew] = useState("");
  const [yearNew, setYearNew] = useState("");

  const dbRef = collection(db, "yearlyWinners");

  const resetStates = () => {
    setDartsNew("");
    setEuchreNew("");
    setHorseshoesNew("");
    setPokerNew("");
    setYearNew("");
  };

  const insertToFire = async () => {
    try {
      await addDoc(dbRef, {
        year: yearNew,
        darts: dartsNew,
        euchre: euchreNew,
        horseshoes: horseshoesNew,
        poker: pokerNew,
      });
      resetStates();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-fluid gameSigns">
      <h2>Game trophy signs!</h2>
      <h3>
        Here are the front and back pictures with the concurrent winners in
        order
      </h3>
      <br />
      <h3>Darts Euchre Horseshoes</h3>
      <br />
      <div className="sign-row">
        <img
          className="sign-image"
          src="src\assets\dartFront.JPG"
          alt="Darts Front"
        />
        <img
          className="sign-image"
          src="src\assets\euchreFront.JPG"
          alt="Euchre Front"
        />
        <img
          className="sign-image"
          src="src\assets\horseShoeFront.JPG"
          alt="Horseshoes Front"
        />
      </div>
      <div className="sign-row">
        <img
          className="sign-image"
          src="src\assets\dartBack.JPG"
          alt="Darts Back"
        />
        <img
          className="sign-image"
          src="src\assets\euchreBack.JPG"
          alt="Euchre Back"
        />
        <img
          className="sign-image"
          src="src\assets\horseShoeBack.JPG"
          alt="Horseshoes Back"
        />
      </div>
    </div>
  );
};
