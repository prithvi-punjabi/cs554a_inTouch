import { printIntrospectionSchema } from "graphql";
import React, { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
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
  const [allChannels, setAllChannels] = useState([]);
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
  const [skip, setSkip] = useState(false);
  const {
    loading: cLoading,
    error: cError,
    data: cData,
  } = useQuery(queries.channel.GET, {
    skip: skip,
    variables: { userId: userId },
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, []);


  useEffect(() => {
    if (!cLoading && !!cData) {
      console.log(cData);
      setSkip(true);
      setAllChannels(cData.getChannelsForUser);
    }
  }, [cLoading, cData]);

  useEffect(() => {
    if (cError) {
      console.log(cError);
    }
  }, [cError]);

  const [currentBody, setCurrentBody] = useState(component);
  const [currentChannel, setCurrentChannel] = useState(component);
  const [showSideBar, setshowSideBar] = useState(true);

  useEffect(() => {

    console.log(currentChannel)
      
  }, [currentChannel])

  console.log(showSideBar)

  if (data) {
    return (
      <>
        <Navbar currentBody={setCurrentBody} user={data.getUser} showSideBar={setshowSideBar} Sidebar={showSideBar} ></Navbar>
        <Appbody>
          {/* { showSideBar && showSideBar === true && ( */}
          <Sidebar
            currentBody={setCurrentBody}
            setChannel={setCurrentChannel}
            allChannels={allChannels}
            user={data.getUser}
            showSideBar={setshowSideBar}
            Sidebar={showSideBar}
          ></Sidebar>
           {/* )}  */}
           
          

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

`;
