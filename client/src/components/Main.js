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
import ChannelDeets from "./ChannelDeets";
import Friends from "./Friends";
import queries from "../queries";
import { CircularProgress } from "@mui/material";
import Search from "./Search";
import Swal from "sweetalert2";
import useSound from "use-sound";
import bambooSfx from "../sound/ios-bamboo.mp3";
import duckSfx from "../sound/duck.mp3";
import hmmSfx from "../sound/hmm.mp3";

function Main({ component, person }) {
  const userId = localStorage.getItem("userId");

  let navigate = useNavigate();
  const [allChannels, setAllChannels] = useState(null); //allChannels Main ARRAY
  const [readStatusObj, setReadStatusObj] = useState([]);
  const [currentBody, setCurrentBody] = useState(component);
  const [currentChannelId, setCurrentChannelId] = useState(null);
  const [currentChannel, setCurrentChannel] = useState([]); //previously default state was component why??
  const [showSideBar, setshowSideBar] = useState(true);
  const [skip, setSkip] = useState(false);
  const [userQCalled, setUserQCalled] = useState(false);
  const [searchTerm, setSearchTerm] = useState();
  const [showCard, setShowCardProfile] = useState(false);
  const [playBamboo] = useSound(bambooSfx);
  const [playDuck] = useSound(duckSfx);
  const [playHmm] = useSound(hmmSfx);
  //QUERY FOR USER OBJECT
  const { loading, data, error } = useQuery(queries.user.GET_BY_ID, {
    variables: { userId: userId },

    fetchPolicy: "network-only",
    errorPolicy: "all",
    onError: (error) => {
      playDuck();
      Swal.fire({
        title: "Oops!",
        text: "Couldn't fetch User",
        icon: "error",
        confirmButtonText: "I'll fix it!",
      });
    },
  });

  //READ STATUS UPDATE
  const [dbUpdateRead, { data: rData, error: rError }] = useMutation(
    queries.user.UPDATE_MESSAGE_READ
  );

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
      let readStatusObjTemp = {};
      data.getUser.readStatus.forEach((element) => {
        let newObj = {};
        newObj = { ...element };
        readStatusObjTemp[element.c_id] = newObj;
      });
      setReadStatusObj(readStatusObjTemp);
      setUserQCalled(true);
    }
  }, [data]);

  //UPDATING READ STATUS ON NEW MESSAGE ARRIVAL ****** THIS IS KINDA BOTHERSOME**** CHECK IF BUGS
  useEffect(() => {
    if (allChannels && readStatusObj) {
      let readStatusTemp = { ...readStatusObj };
      for (let key in readStatusTemp) {
        readStatusTemp[key].cCount =
          allChannels[readStatusTemp[key].c_id].messages.length; // NEW MESSAGE LENGTH VALUES
      }
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
      setAllChannels(allChatTemp);
    }
    if (!cLoading && !!cData) {
      fetchData(cData.getChannelsForUser);
    }
  }, [cData]);

  //ERROR CONSOLE ON INITIAL GET CHANNEL
  useEffect(() => {
    if (cError) {
      playDuck();
      if (!Swal.isVisible()) {
        Swal.fire({
          title: "Oops!",
          text: "Couldn't fetch channel for the user",
          icon: "error",
          confirmButtonText: "I'll fix it!",
        });
      }
    }
  }, [cError]);

  //SETTING CURRENT CHANNEL TO STATE
  useEffect(() => {
    if (allChannels !== null && currentChannelId) {
      setCurrentChannel(allChannels[currentChannelId]);
    }
  }, [currentChannelId, allChannels]);

  //PROCESSOR FOR MAIN SUBSCRIPTION FOR MESSAGES
  useEffect(() => {
    function distributor(prevChannels, channels) {
      let allChatTemp = { ...prevChannels };
      allChatTemp[String(channels._id)] = channels;
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
        dbUpdateRead({
          variables: {
            c_id: String(channels._id),
            mCount: channels.messages.length,
          },
        });
        playHmm();
      } else {
        playBamboo();
      }
    }
    if (subData !== undefined) {
      fetchData(subData.channels);
      autoUpdateReadIfSameChannel(subData.channels);
    }
  }, [subData]);

  //UPDATED READ VALUE SETTER
  useEffect(() => {
    if (rData) {
      //MIGHT REQUIRE ALL CHANNELS TO BE NOT EMPTY
      let readStatusObj = {};
      rData.readChange.forEach((element) => {
        let newObj = {};
        newObj = { ...element };
        newObj.cCount = allChannels[element.c_id].messages.length; // NEW MESSAGES COUNT VALUE

        readStatusObj[element.c_id] = newObj;
      });
      setReadStatusObj(readStatusObj);
    }
  }, [rData]);

  useEffect(() => {
    window.matchMedia("(max-width: 1442px)").addEventListener("change", (e) => {
      // console.log(e);

      if (e.matches === true) {
        setShowCardProfile(true);
      }
      if (e.matches === false) {
        setShowCardProfile(false);
      }
    });
  });

  useEffect(() => {
    if (window.matchMedia("(max-width: 1442px)").matches) {
      setShowCardProfile(true);
    } else {
      setShowCardProfile(false);
    }
  });

  if (data) {
    return (
      <>
        <Navbar
          setCurrentBody={setCurrentBody}
          currentBody={currentBody}
          user={data.getUser}
          showSideBar={setshowSideBar}
          currentChannelId={currentChannelId}
          Sidebar={showSideBar}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        ></Navbar>
        <Appbody>
          <Sidebar
            setCurrentBody={setCurrentBody}
            currentBody={currentBody}
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
          {currentBody && currentBody === "feed" && (
            <Posts
              setCurrentBody={setCurrentBody}
              currentBody={currentBody}
              user={data.getUser}
            ></Posts>
          )}

          {currentBody && currentBody === "search" && (
            <Search
              setCurrentBody={setCurrentBody}
              currentBody={currentBody}
              searchTerm={searchTerm}
            ></Search>
          )}

          {currentBody && currentBody === "user" && person !== "self" && (
            <Profile
              setCurrentBody={setCurrentBody}
              currentChannelId={currentChannelId}
              showCardProfile={showCard}
            ></Profile>
          )}

          {currentBody && currentBody === "user" && person === "self" && (
            <Profile
              setCurrentBody={setCurrentBody}
              currentChannelId={currentChannelId}
              showCardProfile={showCard}
            ></Profile>
          )}

          {data && currentBody && currentBody === "channel" && (
            <Chat
              currentBody={setCurrentBody}
              currentChannel={currentChannel}
              user={data.getUser}
              readObj={readStatusObj}
              setReadObj={setReadStatusObj}
            />
          )}
          {currentBody && currentBody === "friends" && (
            <Friends
              setCurrentBody={setCurrentBody}
              currentBody={currentBody}
            ></Friends>
          )}
          {currentBody && currentBody === "members" && (
            <ChannelDeets
              currentBody={currentBody}
              setCurrentBody={setCurrentBody}
            ></ChannelDeets>
          )}
        </Appbody>
      </>
    );
  }
  if (loading) {
    return (
      <div className="displayContainer">
        <CircularProgress color="success" />
      </div>
    );
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
