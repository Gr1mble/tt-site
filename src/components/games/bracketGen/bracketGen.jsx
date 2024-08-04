import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import "./bracketGen.css";

export const BracketGen = () => {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [bracket, setBracket] = useState([]);

  const playerCollectionRef = collection(db, "players");

  const getPlayers = async () => {
    try {
      const data = await getDocs(playerCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlayers(filteredData);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  useEffect(() => {
    getPlayers();
  }, []);

  const insertToFire = async () => {
    try {
      await addDoc(playerCollectionRef, { raceName: playerName });
      resetStates();
      getPlayers();
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };

  const resetStates = () => {
    setPlayerName("");
  };

  const generateBracket = () => {
    let shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
    const pairs = [];

    // If odd number of players, give the last one a bye in the first round
    if (shuffledPlayers.length % 2 !== 0) {
      // Remove and store the last player from the list for the bye
      const byePlayer = shuffledPlayers.pop();
      pairs.push([byePlayer, null]); // Pair with null to indicate a bye
    }

    // Create pairs for the remaining players
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      pairs.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
    }

    setBracket(pairs);
  };

  return (
    <div className="container-fluid bracketGen">
      <div className="formEntry">
        <input
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={insertToFire}>Submit</button>
      </div>
      <div className="playerList">
        <h2>Players</h2>
        <ul>
          {players.map((player) => (
            <li key={player.id}>{player.raceName}</li>
          ))}
        </ul>
      </div>
      <div className="bracketSection">
        <h2>Tournament Bracket</h2>
        <button onClick={generateBracket}>Generate Bracket</button>
        <div className="bracket">
          {bracket.map((pair, index) => (
            <div key={index} className="round">
              <div className="match">
                <div className="player">
                  {pair[0] ? pair[0].raceName : "Bye"}
                </div>
                <div className="line"></div>
                <div className="player">
                  {pair[1] ? pair[1].raceName : "Bye"}
                </div>
              </div>
              {index < bracket.length - 1 && <div className="connector"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
