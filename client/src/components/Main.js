import { printIntrospectionSchema } from "graphql";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Posts from "./Posts";
import { useNavigate } from "react-router";
import { isLoggedIn } from "../helper";
import Profile from "./Profile";
import Chat from "./Chat";
import queries from "../queries";
//currentBody fun
function Main({ component }) {
  const userId = localStorage.getItem("userId");

  let navigate = useNavigate();

  const { loading, data, error } = useQuery(queries.user.GET_BY_ID, {
    variables: { userId: userId },
    errorPolicy: "all",
    onError: (error) => {
      console.log(error);
    },
  });
  if (data) {
    console.log(data);
  }

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, []);

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

          {data && currentBody && currentBody === "channel" && (
            <Chat currentChannel={currentChannel} user={data.getUser} />
          )}
        </Appbody>
      </>
    );
  }
  if (loading) {
    return <p>loader page goes here</p>;
  }
  if (error) {
    return <p>Couldnt get user from gql</p>;
  } else {
    return <div></div>;
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
