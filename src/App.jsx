import "./App.css";
import Rainbow from "../src/assets/rainbow.jpg";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <div className="container-fluid home">
      <h3>
        <span style={{ fontSize: "150px", color: "black" }}>T</span>
        <span style={{ marginLeft: "-25px", color: "black" }}>errific </span>
        <span
          style={{ fontSize: "150px", marginLeft: "-20px", color: "black" }}
        >
          T
        </span>
        <span style={{ marginLeft: "-25px", color: "black" }}>en</span>
      </h3>
      <br />
      <h4 style={{ fontWeight: "bold" }}>
        Welcome to the official North Carolina Race Headquarters!
      </h4>
      <p>
        The Race is an annual event that occurs every Labor Day weekend. This
        event is to commemorate the creation of the Terrific Ten which takes
        place from Friday through Monday!
      </p>
      <img id="rainbowImg" src={Rainbow} alt="Rainbow over Little Lake" />
    </div>
  );
}

export default App;
