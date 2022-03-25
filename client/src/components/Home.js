import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <p>
        Hello! And welcome to Stevens inTouch. To begin, kindly generate and
        paste your Canvas Access Token in the box below. If you do not know how
        to generate your Access token, click{" "}
        <Link to="/token-how-to">here</Link>.
      </p>
    </div>
  );
};

export default Home;
