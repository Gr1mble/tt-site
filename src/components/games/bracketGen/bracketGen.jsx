import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { auth } from "../../../config/firebase";
import "./bracketGen.css";

export const BracketGen = () => {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [bracket, setBracket] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const playerCollectionRef = collection(db, "players");

  useEffect(() => {
    getPlayers();
  }, []);

  const getPlayers = async () => {
    try {
      const data = await getDocs(playerCollectionRef);
      setPlayers(
        data.docs.map((doc) => ({ id: doc.id, name: doc.data().name }))
      );
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const addPlayer = async () => {
    if (playerName.trim() === "") {
      setError("Player name cannot be empty.");
      return;
    }

    if (
      players.some(
        (player) => player.name.toLowerCase() === playerName.toLowerCase()
      )
    ) {
      setError("Player name already exists.");
      return;
    }

    try {
      await addDoc(playerCollectionRef, { name: playerName });
      setPlayerName("");
      getPlayers();
    } catch (error) {
      console.error("Error adding player:", error);
      setError("An error occurred while adding the player.");
    }
  };

  const removePlayer = async (id) => {
    try {
      await deleteDoc(doc(db, "players", id));
      getPlayers();
    } catch (error) {
      console.error("Error deleting player:", error);
      setError("An error occurred while deleting the player.");
    }
  };

  const generateBracket = () => {
    setLoading(true);
    let shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const rounds = [];
  
    const firstRound = [];
    if (shuffledPlayers.length % 2 !== 0) {
      firstRound.push([{ name: "Bye" }, shuffledPlayers.pop()]);
    }
  
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      firstRound.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
    }
  
    rounds.push(firstRound);
  
    while (rounds[rounds.length - 1].length > 1) {
      const previousRound = rounds[rounds.length - 1];
      const nextRound = [];
  
      for (let i = 0; i < previousRound.length; i += 2) {
        nextRound.push([previousRound[i][0], previousRound[i + 1]?.[0] || { name: "Bye" }]);
      }
  
      rounds.push(nextRound);
    }
  
    setBracket(rounds);
    setLoading(false);
  };
  

  return (
    <div className="bracket-container">
      {auth?.currentUser && (
        <div className="player-input">
          <input
            type="text"
            placeholder="Enter Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={addPlayer}>Add Player</button>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
      <div className="player-list">
        <h2>Players</h2>
        <ul>
          {players.map((player) => (
            <li key={player.id}>
              {player.name}
              {auth?.currentUser && (
                <button onClick={() => removePlayer(player.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="bracket-section">
        <h2>Tournament Bracket</h2>
        <button onClick={generateBracket} disabled={loading}>
          {loading ? "Generating..." : "Generate Bracket"}
        </button>
        <div className="bracket">
          {bracket.map((round, roundIndex) => (
            <div key={roundIndex} className="round">
              {round.map((match, matchIndex) => (
                <div key={matchIndex} className="match">
                  <span>{match[0].name}</span>
                  <span className="vs">vs</span>
                  <span>{match[1]?.name || "Bye"}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
