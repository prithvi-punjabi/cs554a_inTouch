import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
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
  const [allChannels, setAllChannels] = useState(null); //allChannels Main ARRAY
  // const [allChannelsArr, setAllChannelsArr] = useState([]);
  const [readStatusObj, setReadStatusObj] = useState([]);
  const [currentBody, setCurrentBody] = useState(component);
  const [currentChannelId, setCurrentChannelId] = useState(null);
  const [currentChannel, setCurrentChannel] = useState([]); //previously default state was component why??
  const [showSideBar, setshowSideBar] = useState(true);
  const [skip, setSkip] = useState(false);
  const [userQCalled, setUserQCalled] = useState(false);
  // const [userData, ]
  //QUERY FOR USER OBJECT
  const { loading, data, error } = useQuery(queries.user.GET_BY_ID, {
    variables: { userId: userId },
    // skip: userSkip,
    fetchPolicy: "network-only",
    errorPolicy: "all",
    onError: (error) => {
      console.log(error);
    },
  });

  //READ STATUS UPDATE
  const [dbUpdateRead, { data: rData, error: rError }] = useMutation(
    queries.user.UPDATE_MESSAGE_READ
  );

  if (rError) {
    console.log(rError);
  }
  //QUERY FOR GETTING CHANNELS FOR USER (RUNS ONLY ONCE)
  const {
    loading: cLoading,
    error: cError,
    data: cData,
  } = useQuery(queries.channel.GET, {
    skip: skip,
    fetchPolicy: "network-only", // Had to do network only, otherwise on relogin
    //older channels were being fetched
    variables: { userId: userId },
  });

  //SUBSCRIPTION FOR USER (GETS NEW MESSAGES HERE)
  const {
    data: subData,
    loading: subLoading,
    error: subError,
  } = useSubscription(queries.channel.SUBSCRIBE_MESSAGE, {
    variables: {
      userId: userId,
    },
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, []);

  //INITIATING READ VALUES
  useEffect(() => {
    if (data) {
      console.log(data);
      console.log("reading from initial user");
      console.log(data.getUser.readStatus);
      let readStatusObjTemp = {};
      data.getUser.readStatus.forEach((element) => {
        // console.log(allChannels);
        let newObj = {};
        newObj = { ...element };
        readStatusObjTemp[element.c_id] = newObj;
      });
      console.log(readStatusObjTemp);
      setReadStatusObj(readStatusObjTemp);
      setUserQCalled(true);
    }
  }, [data]);

  //UPDATING READ STATUS ON NEW MESSAGE ARRIVAL ****** THIS IS KINDA BOTHERSOME**** CHECK IF BUGS
  useEffect(() => {
    if (allChannels && readStatusObj) {
      console.log("Updating values on new message (ALL CHANNELS CHANGED)");
      let readStatusTemp = { ...readStatusObj };
      for (let key in readStatusTemp) {
        readStatusTemp[key].cCount =
          allChannels[readStatusTemp[key].c_id].messages.length; // NEW MESSAGE LENGTH VALUES
      }
      console.log(readStatusTemp);
      setReadStatusObj(readStatusTemp);
    }
  }, [allChannels, userQCalled]);

  //INITIATING CHANNELS
  useEffect(() => {
    async function fetchData(channels) {
      setSkip(true);
      let allChatTemp = {};
      for (let i = 0; i <= channels.length - 1; i++) {
        allChatTemp[channels[i]._id] = channels[i];
      }
      console.log(allChatTemp);
      setAllChannels(allChatTemp);
    }
    if (!cLoading && !!cData) {
      fetchData(cData.getChannelsForUser);
    }
  }, [cData]);

  //ERROR CONSOLE ON INITIAL GET CHANNEL
  useEffect(() => {
    if (cError) {
      console.log(cError);
    }
  }, [cError]);

  //SELECTED CHANNEL OBJ CONSOLE
  useEffect(() => {
    if (allChannels !== null && currentChannelId) {
      setCurrentChannel(allChannels[currentChannelId]);
      console.log("Selected channel Obj");
      console.log(currentChannelId);
    }
  }, [currentChannelId, allChannels]);

  //PROCESSOR FOR MAIN SUBSCRIPTION FOR MESSAGES
  useEffect(() => {
    function distributor(prevChannels, channels) {
      let allChatTemp = { ...prevChannels };
      allChatTemp[String(channels._id)] = channels;
      // let index = allChatTemp.findIndex((ele, ind) => {
      //   return String(ele._id) == String(channels._id);
      // });
      // allChatTemp[index] = channels;
      /////////
      // console.log(allChatTemp);
      return allChatTemp;
    }
    async function fetchData(channels) {
      setAllChannels((prev) => {
        return distributor(prev, channels);
      });
    }
    async function autoUpdateReadIfSameChannel(channels) {
      if (
        currentBody === "channel" &&
        currentChannelId === String(channels._id)
      ) {
        console.log("pehli baat");
        dbUpdateRead({
          variables: {
            c_id: String(channels._id),
            mCount: channels.messages.length,
          },
        });
      }
    }
    if (subData !== undefined) {
      fetchData(subData.channels);
      autoUpdateReadIfSameChannel(subData.channels);
    }
  }, [subData]);

  //UPDATED READ VALUE SETTER
  useEffect(() => {
    console.log("due here");
    if (rData) {
      //MIGHT REQUIRE ALL CHANNELS TO BE NOT EMPTY
      console.log("gotin");
      let readStatusObj = {};
      rData.readChange.forEach((element) => {
        // console.log(allChannels);
        let newObj = {};
        newObj = { ...element };
        newObj.cCount = allChannels[element.c_id].messages.length; // NEW MESSAGES COUNT VALUE

        readStatusObj[element.c_id] = newObj;
      });
      console.log(readStatusObj);
      setReadStatusObj(readStatusObj);
    }
    // else if (allChannels !== null && readStatusObj !== null) {
    //   let newObj = { ...readStatusObj };
    //   for (let obj in newObj) {
    //     console.log(obj);
    //     obj.cCount = allChannels[obj.c_id].messages.length;
    //   }
    //   setReadStatusObj(newObj);
    // }
    console.log("bruh");
  }, [rData]);

  if (data) {
    return (
      <>
        <Navbar
          currentBody={setCurrentBody}
          user={data.getUser}
          showSideBar={setshowSideBar}
          Sidebar={showSideBar}
        ></Navbar>
        <Appbody>
          {/* { showSideBar && showSideBar === true && ( */}
          <Sidebar
            currentBody={setCurrentBody}
            setChannelId={setCurrentChannelId}
            currentChannelId={currentChannelId}
            user={data.getUser}
            showSideBar={setshowSideBar}
            Sidebar={showSideBar}
            readArr={data.getUser.readStatus}
            setReadObj={setReadStatusObj}
            readObj={readStatusObj}
            dbUpdateRead={dbUpdateRead}
          ></Sidebar>
          {/* )}  */}

          {currentBody && currentBody === "feed" && (
            <Posts currentBody={setCurrentBody} user={data.getUser}></Posts>
          )}

          {currentBody && currentBody === "user" && <Profile></Profile>}

          {data && currentBody && currentBody === "channel" && (
            <Chat
              currentChannel={currentChannel}
              user={data.getUser}
              readObj={readStatusObj}
              setReadObj={setReadStatusObj}
            />
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
const Sidebar1 = styled.div``;
