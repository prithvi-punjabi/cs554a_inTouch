import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SideOptions from "./SideOptions";
// import InboxIcon from "@material-ui/icons"

import InboxIcon from "@mui/icons-material/Inbox";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from "@mui/icons-material/Add";

import queries from "../queries";
import { useQuery, useSubscription } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";

function Sidebar(props) {
  const navigate = useNavigate();

  let userId = localStorage.getItem("userId");

  const { loading, error, data } = useQuery(queries.channel.GET, {
    fetchPolicy: "network-only",
  });

  const [allChannels, setAllChannels] = useState({});
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [readState, setReadState] = useState({});

  useEffect(() => {
    async function fetchData(channels) {
      let allChatTemp = {};
      for (let i = 0; i <= channels.length - 1; i++) {
        allChatTemp[channels[i]._id] = channels[i];
      }
      setAllChannels(allChatTemp);
    }
    if (data !== undefined) {
      fetchData(data.getChannelsForUser);
    }
  }, [data]);

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
    console.log(subData);
    async function fetchData(channels) {
      let allChatTemp = {};
      for (let i = 0; i <= channels.length - 1; i++) {
        allChatTemp[channels[i]._id] = channels[i];
      }
      console.log(allChatTemp);
      setAllChannels(allChatTemp);
    }
    if (subData !== undefined) {
      fetchData(subData.channels);
    }
  }, [subData]);
  useEffect(() => {
    console.log("allChannels Updated");
    setChannel(allChannels[selectedChannelId]);
  }, [allChannels]);
  if (data) {
    console.log(data);
  }

  const [showChannels, setshowChannels] = useState(false);

  const setBody = (type) => {
    props.currentBody(type);
  };

  const setChannel = (channel) => {
    props.setChannel(channel);
  };

  const channelMap = () => {
    return data.getChannelsForUser?.map((ch) => (
      <div
        onClick={() => {
          setBody("channel");
        }}
      >
        <SideOptions title={ch.name} />
      </div>
    ));
  };

  // let channels = channelMap()

  return (
    <SidebarContainer>
      <Sidebarheader>
        <Sidebarinfo>{props.user && <h2>{props.user.name}</h2>}</Sidebarinfo>
      </Sidebarheader>
      <hr />

      <div
        onClick={() => {
          setBody("feed");
          navigate("/main");
        }}
      >
        <SideOptions Icon={InboxIcon} title="Feed" />
      </div>

      {/* <SideOptions Icon = {ExpandLessIcon} title = "Show less"/> */}
      <hr />

      {/* <SideOptions Icon = {AddIcon} title = "Add Channels"/> */}

      {showChannels && (
        <div
          onClick={() => {
            setshowChannels(!showChannels);
            navigate("/main");
          }}
        >
          <SideOptions Icon={ArrowDropDownIcon} title="Channels" />
          <div>{/* {channelMap()} */}</div>
        </div>
      )}

      {!showChannels && (
        <div
          onClick={() => {
            setshowChannels(!showChannels);
          }}
        >
          <SideOptions Icon={ArrowRightOutlinedIcon} title="Channels" />
        </div>
      )}

      {showChannels &&
        data.getChannelsForUser?.map((ch) => (
          <div
            onClick={() => {
              setBody("channel");
              setChannel(ch);
              setSelectedChannelId(ch._id);
              navigate("/main");
            }}
            key={ch.name}
          >
            <SideOptions title={ch.name} />
          </div>
        ))}
      <hr />
    </SidebarContainer>
  );
}

export default Sidebar;

const SidebarContainer = styled.div`
  background-color: var(--intouch-color1);

  flex: 0.4;
  border-top: 1px solid var(--intouch-color1);
  max-width: 260px;
  margin-top: 3.9%;

  color: white;

  > hr {
    margin-top: 10px;
    margin-bottom: 10px;
    border: 1px solid var(--intouch-color1);
  }
  > ul {
    margin: 0;
    padding: 0;
    user-select: none;
    box-sizing: border-box;
  }
  > ul > li {
    margin: 0;
    padding: 0;
    user-select: none;
    box-sizing: border-box;
  }
  > ul > li > ul {
    margin: 0;
    padding: 0;
    user-select: none;
    box-sizing: border-box;
  }
  > ul > li > ul > li {
    margin: 0;
    padding: 0;
    user-select: none;
    box-sizing: border-box;
  }
`;

const Sidebarheader = styled.div`
  display: flex;

  border-bottom: 1px solid var(--intouch-color1);
  padding-top: 15px;
`;

const Sidebarinfo = styled.div`
  flex: 1;
`;
