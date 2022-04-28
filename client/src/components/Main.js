import { printIntrospectionSchema } from "graphql";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Posts from "./Posts";
import { useNavigate } from "react-router";
import { isLoggedIn } from "../helper";
//currentBody fun
function Main() {
  let navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, []);
  const [currentBody, setCurrentBody] = useState();
  if (currentBody === "feed") {
    console.log("shown Feed");
    return (
      <>
        <Navbar></Navbar>
        <Appbody>
          <Sidebar currentBody={setCurrentBody}></Sidebar>
          <Posts></Posts>
        </Appbody>
        {/* <Displaybody></Displaybody> */}
      </>
    );
  } else {
    return (
      <>
        <Navbar></Navbar>
        <Appbody>
          <Sidebar currentBody={setCurrentBody}></Sidebar>
        </Appbody>
      </>
    );
  }
}

export default Main;

const Appbody = styled.div`
  display: flex;
  height: 100vh;
`;
const Displaybody = styled.div`
  display: flex;
  flex: 0.4;
  height: 100vh;
`;
