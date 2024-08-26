import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Include your existing CSS file
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from "./components/footer/footer";
import { Nav } from "./components/navbar/nav";
import { Account } from "./components/account/account";
import { Racenotes } from "./components/racenotes/racenotes";
import { Auth } from "./components/auth/auth";
import { GamesInfo } from "./components/games/gamesInfo/gamesInfo";
import { RaceSigns } from "./components/raceSigns/raceSigns";
import { GameSigns } from "./components/games/gameSigns/gameSigns";
import { FoodMenu } from "./components/foodMenu/foodMenu";
import { BracketGen } from "./components/games/bracketGen/bracketGen";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Nav />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/account" element={<Account />} />
          <Route path="/racenotes" element={<Racenotes />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/bracketgenerator" element={<BracketGen />} />
          <Route path="/gamesInfo" element={<GamesInfo />} />
          <Route path="/gameSigns" element={<GameSigns />} />
          <Route path="/raceSigns" element={<RaceSigns />} />
          <Route path="/foodMenu" element={<FoodMenu />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  </React.StrictMode>
);
