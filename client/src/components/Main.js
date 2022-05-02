import { printIntrospectionSchema } from "graphql";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Posts from "./Posts";
import { useNavigate } from "react-router";
import { isLoggedIn } from "../helper";
import Profile from "./Profile";
import Chat from "./Chat";
import { useQuery } from "@apollo/client";
import queries from "../queries";

//currentBody fun
function Main({ component }) {
  let navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, []);
  const userId = localStorage.getItem("userId");
  const { loading, error, data } = useQuery(queries.user.GET_BY_ID, {
    variables: {
      userId: userId,
    },
    errorPolicy: "all",
    onError: (error) => {
      console.log(error);
    },
  });
  const [currentBody, setCurrentBody] = useState(component);
  const [currentChannel, setCurrentChannel] = useState(component);

  if (data) {
    return (
      <>
        <Navbar currentBody={setCurrentBody} user={data.getUser}></Navbar>
        <Appbody>
          <Sidebar
            currentBody={setCurrentBody}
            setChannel={setCurrentChannel}
            user={data.getUser}
          ></Sidebar>
          {currentBody && currentBody === "feed" && (
            <Posts currentBody={setCurrentBody} user={data.getUser}></Posts>
          )}

          {currentBody && currentBody === "user" && <Profile></Profile>}

          {currentBody && currentBody === "channel" && (
            <Chat currentChannel={currentChannel} />
          )}
        </Appbody>
      </>
    );
  } else if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>{error.message}</div>;
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
const Sidebar1 = styled.div`
  position: fixed;
`;
