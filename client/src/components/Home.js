import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../img/inTouch.png";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="inTouch Logo" />
        <h1 className="App-title">Welcome to Stevens inTouch!</h1>
      </header>
      <br />
      <br />
      <p>
        Hello! And welcome to Stevens inTouch. To begin, kindly generate your
        Canvas Access Token, and then click the Sign Up button below. If you are
        already a registered user of inTouch, use the Sign in button to sign in
        to your account. If you do not know how to generate your Access token,
        click <Link to="/token-how-to">here</Link>
      </p>
      <br />
      <button onClick={() => navigate("/signup")}>Sign up</button>
      <span> </span>
      <button>Sign in</button>
    </div>
  );
};

export default Home;
