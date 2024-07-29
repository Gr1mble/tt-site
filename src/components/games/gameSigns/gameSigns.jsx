import React, { useEffect, useState } from "react";
import "./gameSigns.css";
import { auth, db } from "../../../config/firebase";
import { collection, doc, addDoc } from "firebase/firestore";

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
      <div className="formEntry">
        <input
          placeholder="year"
          value={yearNew}
          onChange={(e) => setYearNew(e.target.value)}
        ></input>
        <input
          placeholder="darts"
          value={dartsNew}
          onChange={(e) => setDartsNew(e.target.value)}
        ></input>
        <input
          placeholder="euchre"
          value={euchreNew}
          onChange={(e) => setEuchreNew(e.target.value)}
        ></input>
        <input
          placeholder="horseshoes"
          value={horseshoesNew}
          onChange={(e) => setHorseshoesNew(e.target.value)}
        ></input>
        <input
          placeholder="poker"
          value={pokerNew}
          onChange={(e) => setPokerNew(e.target.value)}
        ></input>

        <button onClick={insertToFire}>Submit</button>
      </div>
    </div>
  );
};
