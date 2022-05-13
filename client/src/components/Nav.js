import React from "react";
import Navbar from "react-bootstrap/Navbar";
import logo from "../img/inTouch.png";

const Nav = () => {
  return (
    <Navbar className="color-nav" variant="light">
      <Navbar.Brand href="#home">
        <img
          alt="inTouch Logo"
          src={logo}
          width="20"
          height="20"
          className="d-inline-block align-top"
        />{" "}
        <span className="nameLogo">inTouch</span>
      </Navbar.Brand>
    </Navbar>
  );
};

export default Nav;
