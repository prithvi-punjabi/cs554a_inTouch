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
import { useLazyQuery, useQuery, useSubscription } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import { useBadge } from "@mui/base";

function Sidebar(props) {
  const navigate = useNavigate();
  // console.log(props);
  let userId = localStorage.getItem("userId");

  const data = props.allChannels;

  const [allChannels, setAllChannels] = useState({});
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [readState, setReadState] = useState({});
  const [cData, setcDataState] = useState([]);
  const [showChannels, setshowChannels] = useState(false);
  useEffect(() => {
    console.log("All and read set");
    console.log(data);
    async function fetchData(channels) {
      console.log("DATA CHANGED");
      console.log(channels.length);
      let allChatTemp = {};
      let readStateTemp = {};
      for (let i = 0; i <= channels.length - 1; i++) {
        allChatTemp[channels[i]._id] = channels[i];
        readStateTemp[channels[i]._id] = channels[i].messages.length;
      }
      setAllChannels(allChatTemp);
      //Currently setting from allChannel, can get from DB for persistence
      setReadState(readStateTemp);
      setcDataState(channels);
    }
    if (data !== undefined) {
      fetchData(data);
    }
  }, [data]);

  useEffect(() => {
    // console.log(readState);
  }, [readState]);

  useEffect(() => {}, [selectedChannelId]);

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
    function distributor(prevChannels, channels) {
      let allChatTemp = { ...prevChannels };
      allChatTemp[String(channels._id)] = channels;
      // let index = allChatTemp.findIndex((ele, ind) => {
      //   return String(ele._id) == String(channels._id);
      // });
      // allChatTemp[index] = channels;
      console.log(allChatTemp);
      return allChatTemp;
    }
    async function fetchData(channels) {
      setAllChannels((prev) => {
        return distributor(prev, channels);
      });
      setcDataState((prev) => {
        let temp_cData = [...prev];
        let index = temp_cData.findIndex((ele, ind) => {
          return String(ele._id) == String(channels._id);
        });
        temp_cData[index] = channels;
        console.log(temp_cData);
        return temp_cData;
      });
    }
    if (subData !== undefined) {
      fetchData(subData.channels);
    }
  }, [subData]);

  useEffect(() => {
    console.log(cData);
  }, [cData]);

  useEffect(() => {
    console.log("allChannels Updated");
    console.log(allChannels);
    console.log(selectedChannelId);
    setChannel(allChannels[selectedChannelId]);
  }, [allChannels]);

  if (data) {
    console.log(data);
  }

  const setBody = (type) => {
    props.currentBody(type);
  };

  const setChannel = (channel) => {
    console.log(channel);
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

  const setSidebar = (type) => {
    props.showSideBar(type);
  };


  useEffect(() => {
    window
    .matchMedia("(max-width: 991px)")
    .addEventListener('change', (e )=> {
      console.log(e)
  
      if(e.matches === true){
        setSidebar(false)
      }
      if(e.matches === false){
        setSidebar(true)
      }
    });

      
    
    
  }, );

  
  let styleStatus = props.Sidebar===false?{display: 'none'}:{display: 'block'}
  
  
  return (
  
      
    <SidebarContainer style={styleStatus} >
      
      <Sidebarheader>
        
        <Sidebarinfo>
        
      {props.user && <h2>{props.user.name}</h2>}</Sidebarinfo>
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
        cData?.map((ch) => {
          if (
            allChannels[String(ch._id)] &&
            allChannels[String(ch._id)].messages.length
          ) {
            // console.log(ch);
            // console.log(
            //   allChannels[String(ch._id)].messages.length,
            //   readState[String(ch._id)]
            // );
          }

          return (
            <div
              onClick={() => {
                setBody("channel");
                setChannel(ch);
                setSelectedChannelId(String(ch._id));
                navigate("/main");
              }}
              key={ch.name}
            >
              <SideOptions
                title={ch.name} 
                read={
                  (allChannels[String(ch._id)] &&
                  allChannels[String(ch._id)].messages.length -
                    readState[String(ch._id)] !=
                    NaN &&
                  allChannels[String(ch._id)].messages.length -
                    readState[String(ch._id)] !=
                    0
                    ? allChannels[String(ch._id)].messages.length -
                      readState[String(ch._id)]
                    : "")
                }
              />
            </div>
          );
        })}
      <hr />
    </SidebarContainer>
  
  );
}

export default Sidebar;



const SidebarContainer = styled.div`
  background-color: var(--intouch-color1);
  display: block;
  flex: 0.4;
  border-top: 1px solid var(--intouch-color1);
  max-width: 290px;
  margin-top: 74px;
  z-index: 2;
  color: white;

  .sidebar-toggle{
    color: #fff;
    float: right;
    line-height: 50px;
    font-size: 24px;
    cursor: pointer;
    display: none;

 }

 @media (max-width:991px) {
  
 

  }
 

 
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
