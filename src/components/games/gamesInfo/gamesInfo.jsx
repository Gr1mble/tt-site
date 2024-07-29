import React, { useEffect, useState } from "react";
import "./gamesInfo.css";
import "../../../css/accordian.css";
import { auth, db } from "../../../config/firebase";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { Dropdown } from "react-bootstrap";

export const GamesInfo = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [yearlyWinners, setYearlyWinners] = useState([]);
  const [currentWinners, setCurrentWinners] = useState([]);
  const [currentYear, setCurrentYear] = useState(2023);
  const [formData, setFormData] = useState({
    darts: "",
    euchre: "",
    horseshoes: "",
    poker: "",
    year: "",
  });

  const dbRef = collection(db, "yearlyWinners");

  const resetForm = () => {
    setFormData({
      darts: "",
      euchre: "",
      horseshoes: "",
      poker: "",
      year: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const insertToFire = async () => {
    try {
      await addDoc(dbRef, formData);
      resetForm();
      getYearlyWinners();
    } catch (error) {
      console.log(error);
    }
  };

  const getYearlyWinners = async () => {
    try {
      const data = await getDocs(dbRef);
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setYearlyWinners(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentWinner = async () => {
    try {
      const docRef = doc(db, "yearlyWinners", currentYear.toString());
      const currentWinnerData = await getDoc(docRef);
      if (currentWinnerData.exists()) {
        setCurrentWinners([currentWinnerData.data()]);
      } else {
        setCurrentWinners([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    getYearlyWinners();
    getCurrentWinner();
    return () => unsubscribe();
  }, [currentYear]);

  return (
    <div className="container-fluid gamesInfo">
      <h2>The annual Race Games consist of...</h2>
      <div id="accordionExample" className="accordion">
        {[
          {
            title: "Poker",
            description:
              "Poker is a game of skill, psychology, and strategy. Understanding the odds, reading other players' behavior, and making well-timed bets are crucial to success. As a result, poker offers a captivating blend of chance and skill that has made it a beloved pastime for players worldwide.",
            howToPlayLink:
              "https://bicyclecards.com/how-to-play/basics-of-poker",
            videoLink: "https://www.youtube.com/watch?v=KuSR4-cVb30",
          },
          {
            title: "Euchre",
            description:
              "Euchre is a popular trick-taking card game typically played with four players in two partnerships. This card game combines strategy, teamwork, and a bit of luck, making it a fun and engaging game for players of all ages.",
            howToPlayLink: "https://bicyclecards.com/how-to-play/euchre",
            videoLink: "https://www.youtube.com/watch?v=MLOS84a6FtQ&t=57s",
          },
          {
            title: "Darts",
            description:
              "Darts Cricket is a game that combines precision, strategy, and a bit of luck. Players must decide which numbers to focus on, whether to go for points or aim to close numbers quickly to prevent their opponents from scoring. The game offers a great balance of competitive challenge and social fun for darts enthusiasts of all skill levels.",
            howToPlayLink: "https://www.dartslive.com/beginner/en/cricket/",
            videoLink: "https://www.youtube.com/watch?v=dMo3iaPeLuI&t=72s",
          },
          {
            title: "Horseshoes",
            description:
              "Horseshoes is a casual and social game that allows players to enjoy the outdoors while engaging in friendly competition. The game can be adapted for different skill levels, making it accessible and enjoyable for players of all ages and abilities.",
            howToPlayLink:
              "https://www.mastersofgames.com/rules/horseshoe-pitching-rules.htm",
            videoLink: "https://www.youtube.com/watch?v=IsALhFAXNYY",
          },
          {
            title: "MarioKart",
            description:
              "In Mario Kart, players take control of a character from the Mario universe and compete in go-kart races against other characters. The primary objective is to finish the race in the best position possible to earn points and win trophies. The races take place on various colorful and imaginative tracks inspired by the Mario series.",
            howToPlayLink:
              "https://play.nintendo.com/news-tips/tips-tricks/mario-kart-8-deluxe-tips-tricks/",
          },
          {
            title: "BeerioKart",
            description:
              "Beerio Kart is a drinking game variation of the popular video game series Mario Kart. It combines the fun of playing Mario Kart with the social aspect of drinking with friends. It is important to note that this game involves drinking alcohol, so it should be played responsibly and only by legal drinking-age participants.",
            howToPlayLink: "https://jasonmccreary.me/articles/beerio-kart/",
          },
        ].map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            description={item.description}
            howToPlayLink={item.howToPlayLink}
            videoLink={item.videoLink}
          />
        ))}
      </div>
      <br></br>

      <div className="yearlyWinnersEntry" hidden={!currentUser?.uid}>
        <input
          placeholder="year"
          name="year"
          value={formData.year}
          onChange={handleInputChange}
        />
        <input
          placeholder="darts"
          name="darts"
          value={formData.darts}
          onChange={handleInputChange}
        />
        <input
          placeholder="euchre"
          name="euchre"
          value={formData.euchre}
          onChange={handleInputChange}
        />
        <input
          placeholder="horseshoes"
          name="horseshoes"
          value={formData.horseshoes}
          onChange={handleInputChange}
        />
        <input
          placeholder="poker"
          name="poker"
          value={formData.poker}
          onChange={handleInputChange}
        />

        <button onClick={insertToFire}>Submit</button>
      </div>

      <div className="yearlyWinners">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {currentYear}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ height: "200px", overflow: "auto" }}>
            {yearlyWinners
              .sort((a, b) => b.year - a.year)
              .map((winner) => (
                <Dropdown.Item
                  key={winner.id}
                  onClick={() => setCurrentYear(winner.year)}
                >
                  {winner.year}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
        <br></br>

        {yearlyWinners
          .filter((entry) => entry.year === currentYear.toString())
          .map((currentWinner) => (
            <div key={currentWinner.id}>
              <p>Year: {currentWinner.year}</p>
              <p>Darts: {currentWinner.darts}</p>
              <p>Euchre: {currentWinner.euchre}</p>
              <p>Horseshoes: {currentWinner.horseshoes}</p>
              <p>Poker: {currentWinner.poker}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

const AccordionItem = ({ title, description, howToPlayLink, videoLink }) => {
  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse${title}`}
          aria-expanded="false"
          aria-controls={`collapse${title}`}
          className="accordion-button collapsed"
        >
          {title}
        </button>
      </h2>
      <div
        id={`collapse${title}`}
        data-bs-parent="#accordionExample"
        className="accordion-collapse collapse"
      >
        <div className="accordion-body">
          <h3>Description</h3>
          <p>{description}</p>
          <br />
          <a
            className="gameButtons"
            rel="noreferrer"
            href={howToPlayLink}
            target="_blank"
          >
            How to Play
          </a>
          {videoLink && (
            <a
              className="gameButtons"
              rel="noreferrer"
              href={videoLink}
              target="_blank"
            >
              Video Explanation
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
