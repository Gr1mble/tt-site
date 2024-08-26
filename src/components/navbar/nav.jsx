import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Chinch from "../../assets/Chinchilla.jpg";
import "./nav.css";
import "./_navbar.scss"; // Assuming this is where your navbar styles are defined
import { auth } from "../../config/firebase";

export const Nav = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      unsubscribe();
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    closeMenu();
  };

  return (
    <nav className="container-fluid navigation navbar navbar-expand-lg bg-body-tertiary">
      <div className="navbar-header">
        <button
          className={`navbar-toggler ${
            isMenuOpen ? "navbar-toggler-white" : ""
          }`}
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img className="navbarPicture" src={Chinch} alt="Chinch Logo" />
        </Link>
      </div>

      <div
        ref={menuRef}
        className={`collapse navbar-collapse navbar-content ${
          isMenuOpen ? "show" : ""
        }`}
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              to="/"
              className="nav-link active"
              aria-current="page"
              onClick={handleLinkClick}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/history" className="nav-link" onClick={handleLinkClick}>
              History
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/racesigns"
              className="nav-link"
              onClick={handleLinkClick}
            >
              Race Signs
            </Link>
          </li>
          <li className="nav-item dropdown">
            <Link
              className="nav-link dropdown-toggle"
              to="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Games
            </Link>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <Link
                  to="/gamesInfo"
                  className="dropdown-item"
                  onClick={handleLinkClick}
                >
                  Info
                </Link>
              </li>
              <li>
                <Link
                  to="/gameSigns"
                  className="dropdown-item"
                  onClick={handleLinkClick}
                >
                  Game Signs
                </Link>
              </li>
              <li>
                <Link
                  to="/bracketgenerator"
                  className="dropdown-item"
                  onClick={handleLinkClick}
                >
                  Bracket Generator
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link to="/foodMenu" className="nav-link" onClick={handleLinkClick}>
              Menu
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/racenotes"
              className="nav-link"
              onClick={handleLinkClick}
            >
              Notes
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={!currentUser?.uid ? "/auth" : "/account"}
              className="nav-link"
              onClick={handleLinkClick}
            >
              {!currentUser?.uid ? "Sign In" : currentUser.email}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
