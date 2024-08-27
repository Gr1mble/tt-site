import React from "react";
import "./gameSigns.css";
import dartFront from "../../../assets/dartFront.JPG";
import dartBack from "../../../assets/dartBack.JPG";
import euchreFront from "../../../assets/euchreFront.JPG";
import euchreBack from "../../../assets/euchreBack.JPG";
import horseShoeFront from "../../../assets/horseShoeFront.JPG";
import horseShoeBack from "../../../assets/horseShoeBack.JPG";
export const GameSigns = () => {
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
        <img className="sign-image" src={dartFront} alt="Darts Front" />
        <img className="sign-image" src={euchreFront} alt="Euchre Front" />
        <img
          className="sign-image"
          src={horseShoeFront}
          alt="Horseshoes Front"
        />
      </div>
      <div className="sign-row">
        <img className="sign-image" src={dartBack} alt="Darts Back" />
        <img className="sign-image" src={euchreBack} alt="Euchre Back" />
        <img className="sign-image" src={horseShoeBack} alt="Horseshoes Back" />
      </div>
    </div>
  );
};
