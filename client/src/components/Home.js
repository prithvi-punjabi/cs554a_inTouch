import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <p>
        Hello! And welcome to Stevens inTouch. To begin, kindly generate and
        paste your Canvas Access Token in the box below. If you do not know how
        to generate your Access token, click{" "}
        <Link to="/token-how-to">here</Link>.
      </p>
      <br />
      <button onClick={handleShow}>Send Access Token</button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter access token below</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <label>Enter your access token</label>
            <br />
            <input></input>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <button variant="primary" onClick={handleClose}>
            Send Token
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
