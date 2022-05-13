import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Channel2 from "./Channel2.js";
import { getUserChannels } from "./Calls.js";
// import io from "socket.io-client";
import queries from "../queries";
//Temp for GQL
import { ApolloClient, useQuery } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const Feed = () => {
  const [userChannels, setUserChannels] = useState([]);
  const location = useLocation();
  const socketRef = useRef();
  const userId = localStorage.getItem("userId");
  //Temp
  const [curUser, setCurUser] = useState(0);
  const userArray = [
    {
      _id: { $oid: "625a770cf1a9ebce0e4d0442" },
      name: "Samarth Kapuria",
      email: "skapuria@stevens.edu",
      password: "$2a$08$s.fFtHV/EDoH.VO4WuCg3uzTe5kpciv9CSlIWzuKr8fWhPsAsozzS",
      profilePicture:
        "https://sit.instructure.com/images/thumbnails/9355423/xY6miPmrcg4BZ5XcGeH8LtxMIh0sEq3VEZhwqI7p",
      userName: "123123",
      bio: "Name: Samarth Kapuria\r\n\r\nMS in Computer Science @ Stevens '23\r\n\r\n \r\n\r\nI have worked as a software developer , working on the MEAN stack, all major social media APIs.\r\n\r\nI have also worked with Arduino and IoT devices as a hobby. \r\n\r\n \r\n\r\nI don't mind pineapple on pizza. Beware :)",
      courses: [
        {
          id: 56734,
          name: "Web Programming II",
          code: "2022S CS 554-A",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56806,
          name: "Database Management Systems I",
          code: "2022S CS 561-B",
          end_date: null,
        },
        {
          id: 58512,
          name: "Agile Methods for Software Development",
          code: "2022S SSW 555-WS",
          end_date: "2022-05-18T00:00:00Z",
        },
      ],
      designation: 1,
      gender: "1",
      contactNo: "1111111111",
      dob: "10/16/1999",
      friends: [],
      privacy: [],
    },
    {
      _id: { $oid: "625a77cbf1a9ebce0e4d044b" },
      name: "Nirav Patel",
      email: "npate94@stevens.edu",
      password: "$2a$08$NAq58pqYJdm.P5J9sDINrOTk32g.I4KU2OOENzNakdAceW94HL2rG",
      profilePicture:
        "https://sit.instructure.com/images/thumbnails/9193066/2FCn5p4nwEO1WQwV7eKpyuErWRoCqUpBEISSMVXs",
      userName: "12313",
      bio: "No bio set in canvas",
      courses: [
        {
          id: 56734,
          name: "Web Programming II",
          code: "2022S CS 554-A",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56806,
          name: "Database Management Systems I",
          code: "2022S CS 561-B",
          end_date: null,
        },
        {
          id: 58512,
          name: "Agile Methods for Software Development",
          code: "2022S SSW 555-WS",
          end_date: "2022-05-18T00:00:00Z",
        },
      ],
      designation: 1,
      gender: "1",
      contactNo: "1111111111",
      dob: "06/16/2000",
      friends: [],
      privacy: [],
    },
  ];
  //End of Temp

  //GQL CHANGE
  const withToken = setContext(() => {
    return { token: localStorage.getItem("token") };
  });
  const { loading, error, data } = useQuery(queries.channel.GET, {
    variables: {
      userId: userId,
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    // console.log(typeof userArray[curUser]._id.$oid);
    console.log(typeof userId);
  }, []);
  //
  //   useEffect(() => {
  //     // console.log(props.user);
  //     async function fetchData() {
  //       try {
  //         let uc = await getUserChannels(userArray[curUser]);
  //         // console.log(uc);
  //         setUserChannels(uc);
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     }
  //     fetchData();
  //     // socketRef.current = io("/");
  //     // socketRef.current.emit("add-user", location.state._id);
  //     // return () => {
  //     // 	socketRef.current.disconnect();
  //     // };
  //   }, [curUser]);

  /////////////////////////FOR SELECTING USER MANUALLY TEST///////////
  // const selectUser = (e) => {
  //   console.log(e.target.value);
  //   setCurUser(e.target.value);
  // };

  if (error) {
    console.log(error);
  }
  if (data) {
    return (
      <div>
        {/* <select onChange={selectUser}>
        <option value="0">User 1</option>
        <option value="1">User 2</option>
      </select> */}
        <p>Welcome</p>
        {/* <p>{location.state.name}</p> */}
        <Channel2
          user={location.state}
          userChannels={data.getChannelsForUser}
          socketRef={socketRef}
        >
          Channel
        </Channel2>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default Feed;
