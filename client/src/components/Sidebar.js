import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SideOptions from "./SideOptions";

import InboxIcon from "@mui/icons-material/Inbox";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

import { useNavigate } from "react-router-dom";

function Sidebar(props) {
  const navigate = useNavigate();
  //PROPS
  const readObj = props.readObj;
  const readArr = props.readArr;
  //STATES
  const [sumOfUnread, setSumOfUnread] = useState(0);
  const [showChannels, setshowChannels] = useState(false);
  //PROPS TO FUNCTIONS
  const setBody = (type) => {
    props.setCurrentBody(type);
  };

  const setChannelId = (channelId) => {
    props.setChannelId(channelId);
  };

  //USE EFFECTS
  useEffect(() => {
    if (readObj) {
      let total = 0;
      for (let key in readObj) {
        total = total + readObj[key].cCount - readObj[key].mCount;
      }
      setSumOfUnread(total);
    }
  }, [readObj]);

  const setSidebar = (type) => {
    props.showSideBar(type);
  };

  useEffect(() => {
    window.matchMedia("(max-width: 991px)").addEventListener("change", (e) => {
      if (e.matches === true) {
        setSidebar(false);
      }
      if (e.matches === false) {
        setSidebar(true);
      }
    });
  });

  let styleStatus =
    props.Sidebar === false ? { display: "none" } : { display: "block" };

  return (
    <SidebarContainer style={styleStatus}>
      <br></br>
      <br></br>
      <br></br>
      <h1 hidden></h1>
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

      <div
        onClick={() => {
          setBody("friends");
          navigate("/main");
        }}
      >
        <SideOptions Icon={PeopleAltOutlinedIcon} title="Friends" />
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
          <SideOptions
            Icon={ArrowRightOutlinedIcon}
            title="Channels"
            read={sumOfUnread}
          />
        </div>
      )}

      {showChannels &&
        readArr?.map((ch) => {
          if (readObj[String(ch.c_id)]) {
            return (
              <div
                onClick={() => {
                  setBody("channel");
                  setChannelId(String(ch.c_id));
                  navigate("/main");
                  props.dbUpdateRead({
                    variables: {
                      c_id: String(ch.c_id),
                      mCount: readObj[String(ch.c_id)].cCount,
                    },
                  });
                }}
                key={ch.cName}
              >
                <SideOptions
                  title={ch.cName}
                  read={
                    readObj[String(ch.c_id)] &&
                    readObj[String(ch.c_id)].cCount -
                      readObj[String(ch.c_id)].mCount !==
                      NaN &&
                    readObj[String(ch.c_id)].cCount -
                      readObj[String(ch.c_id)].mCount !==
                      0 &&
                    (String(ch.c_id) !== String(props.currentChannelId) ||
                      (String(ch.c_id) === String(props.currentChannelId) &&
                        props.currentBody !== "channel"))
                      ? readObj[String(ch.c_id)].cCount -
                        readObj[String(ch.c_id)].mCount
                      : ""
                  }
                />
              </div>
            );
          } else {
            return null;
          }
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

  .sidebar-toggle {
    color: #fff;
    float: right;
    line-height: 50px;
    font-size: 24px;
    cursor: pointer;
    display: none;
  }
  @media (max-width: 991px) {
    /* width: 100px;
      height: 200px;
      overflow-y: scroll;
      overflow-x: scroll;
      position: fixed; */

    flex: 2000;
    max-width: 100%;
    text-align: center;
    align-items: center;
    align-content: center;
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
