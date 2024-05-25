import React from "react";
import "./footer.css";

export const Footer = () => {
  return (
    <div className="container-fluid footer">
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8">
          <h1>Terrific Ten</h1>
          <h1>
            <a
              className="aFooter"
              href="https://www.facebook.com/Camp-Kirkwood-184907419322"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-facebook"></i>
            </a>
          </h1>
          <h1>
            <a className="aFooter" rel="noopener noreferrer" href="/">
              <i className="bi bi-paypal"></i>
            </a>
          </h1>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};
