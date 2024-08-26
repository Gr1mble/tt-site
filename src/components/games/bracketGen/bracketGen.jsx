import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import "./bracketGen.css";
import { auth } from "../../../config/firebase";

export const BracketGen = () => {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [bracket, setBracket] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      if (playerName.trim() === "") {
        setError("Player name cannot be empty.");
        return;
      }

      if (
        players.some(
          (player) => player.raceName.toLowerCase() === playerName.toLowerCase()
        )
      ) {
        setError("Player name already exists.");
        return;
      }

      await addDoc(playerCollectionRef, { raceName: playerName });
      resetStates();
      getPlayers();
    } catch (error) {
      console.error("Error adding player:", error);
      setError("An error occurred while adding the player. Please try again.");
    }
  };

  const deletePlayer = async (id) => {
    try {
      await deleteDoc(doc(db, "players", id));
      getPlayers();
    } catch (error) {
      console.error("Error deleting player:", error);
      setError(
        "An error occurred while deleting the player. Please try again."
      );
    }
  };

  const resetStates = () => {
    setPlayerName("");
    setError("");
  };

  const generateBracket = () => {
    setLoading(true);
    let shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
    const rounds = [];

    if (shuffledPlayers.length % 2 !== 0) {
      const byePlayer = shuffledPlayers.pop();
      rounds.push([[byePlayer, null]]);
    }

    while (shuffledPlayers.length > 0) {
      const round = [];
      for (let i = 0; i < shuffledPlayers.length; i += 2) {
        round.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
      }
      rounds.push(round);
      shuffledPlayers = round.map((match) => match[0]); // Placeholder for the winner's advancement logic
    }

    setBracket([]);
    loadRounds(rounds);
  };

  const loadRounds = (rounds, index = 0) => {
    if (index >= rounds.length) {
      setLoading(false);
      return;
    }

    setBracket((prev) => [...prev, rounds[index]]);

    setTimeout(() => loadRounds(rounds, index + 1), 50); // Adjust delay as needed
  };

  return (
    <div className="container-fluid bracketGen">
      <div className="formEntry">
        <input
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          hidden={!auth?.currentUser}
        />
        <button onClick={insertToFire} hidden={!auth?.currentUser}>
          Submit
        </button>
        {error && <p className="error">{error}</p>}
      </div>
      <div className="playerList">
        <h2>Players</h2>
        <ul>
          {players.map((player) => (
            <li
              key={player.id}
              className={`playerItem ${
                auth?.currentUser ? "loggedInHover" : ""
              }`}
              onClick={() => auth?.currentUser && deletePlayer(player.id)}
              style={{
                cursor: auth?.currentUser ? "pointer" : "default",
              }}
            >
              {player.raceName}
            </li>
          ))}
        </ul>
      </div>

      <div className="bracketSection">
        <h2>Tournament Bracket</h2>
        <button onClick={generateBracket} disabled={loading}>
          {loading ? "Generating..." : "Generate Bracket"}
        </button>
        <div className="bracket">
          {bracket.map((round, roundIndex) => (
            <div key={roundIndex} className="round">
              {round.map((match, matchIndex) => (
                <div key={matchIndex} className="match">
                  <div className="player">
                    {match[0] ? match[0].raceName : "Bye"}
                  </div>
                  <div className="line"></div>
                  <div className="player">
                    {match[1] ? match[1].raceName : "Bye"}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
