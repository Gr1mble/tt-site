import React, { useState } from "react";
import "./gamesInfo.css";

export const GamesInfo = () => {
  const [selectedYear, setSelectedYear] = useState(2011); // Default year

  const gameWinners = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="container-fluid gamesInfo">
      <h2>The annual Race Games consist of...</h2>
      <div id="accordionExample" className="accordion">
        {/* Accordion items */}
        <AccordionItem
          title="Poker"
          description="Poker is a game of skill, psychology, and strategy. Understanding the odds, reading other players' behavior, and making well-timed bets are crucial to success. As a result, poker offers a captivating blend of chance and skill that has made it a beloved pastime for players worldwide."
          howToPlayLink="https://bicyclecards.com/how-to-play/basics-of-poker"
          videoLink="https://www.youtube.com/watch?v=KuSR4-cVb30"
        />
        <AccordionItem
          title="Euchre"
          description="Euchre is a popular trick-taking card game typically played with four players in two partnerships. This card game combines strategy, teamwork, and a bit of luck, making it a fun and engaging game for players of all ages."
          howToPlayLink="https://bicyclecards.com/how-to-play/euchre"
          videoLink="https://www.youtube.com/watch?v=MLOS84a6FtQ&t=57s"
        />
        <AccordionItem
          title="Darts"
          description="Darts Cricket is a game that combines precision, strategy, and a bit of luck. Players must decide which numbers to focus on, whether to go for points or aim to close numbers quickly to prevent their opponents from scoring. The game offers a great balance of competitive challenge and social fun for darts enthusiasts of all skill levels."
          howToPlayLink="https://www.dartslive.com/beginner/en/cricket/"
          videoLink="https://www.youtube.com/watch?v=dMo3iaPeLuI&t=72s"
        />
        <AccordionItem
          title="Horseshoes"
          description="Horseshoes is a casual and social game that allows players to enjoy the outdoors while engaging in friendly competition. The game can be adapted for different skill levels, making it accessible and enjoyable for players of all ages and abilities."
          howToPlayLink="https://www.mastersofgames.com/rules/horseshoe-pitching-rules.htm"
          videoLink="https://www.youtube.com/watch?v=IsALhFAXNYY"
        />
        <AccordionItem
          title="MarioKart"
          description="In Mario Kart, players take control of a character from the Mario universe and compete in go-kart races against other characters. The primary objective is to finish the race in the best position possible to earn points and win trophies. The races take place on various colorful and imaginative tracks inspired by the Mario series."
          howToPlayLink="https://play.nintendo.com/news-tips/tips-tricks/mario-kart-8-deluxe-tips-tricks/"
        />
        <AccordionItem
          title="BeerioKart"
          description="Beerio Kart is a drinking game variation of the popular video game series Mario Kart. It combines the fun of playing Mario Kart with the social aspect of drinking with friends. It is important to note that this game involves drinking alcohol, so it should be played responsibly and only by legal drinking-age participants."
          howToPlayLink="https://jasonmccreary.me/articles/beerio-kart/"
        />
      </div>

      {/* Dropdown to select year */}
      <h4>Use the dropdown below to show the winners over the years!</h4>
      <select
        className="form-select"
        onChange={gameWinners}
        value={selectedYear}
        aria-label="Default select example"
      >
        {Array.from({ length: 12 }, (_, i) => 2011 + i).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* Winners display */}
      <br />
      <p id="poker">Poker: Sassy Sara</p>
      <p id="euchre">Euchre: Sassy Sara</p>
      <p id="darts">Darts: Sassy Sara</p>
      <p id="horseShoes">HorseShoes: Sassy Sara</p>
    </div>
  );
};

const AccordionItem = ({ title, description, howToPlayLink, videoLink }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleAccordion = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          type="button"
          onClick={toggleAccordion}
          className={`accordion-button ${isCollapsed ? "" : "collapsed"}`}
          aria-expanded={!isCollapsed ? "true" : "false"}
        >
          {title}
        </button>
      </h2>
      <div
        className={`accordion-collapse collapse ${isCollapsed ? "" : "show"}`}
        aria-labelledby="collapseOne"
      >
        <div className="accordion-body">
          <h3>Description</h3>
          <p>{description}</p>
          <br></br>
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
