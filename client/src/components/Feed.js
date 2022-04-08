import React from "react";
import { useLocation } from "react-router-dom";

const Feed = () => {
  const location = useLocation();
  return (
    <div>
      <p>Welcome</p>
      <p>{location.state.name}</p>
    </div>
  );
};

export default Feed;
