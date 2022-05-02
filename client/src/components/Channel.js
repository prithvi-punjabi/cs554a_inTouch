import React, { useEffect, useState, useRef, useContext } from "react";
import { AppContext } from "../context/appContext";
import { io } from "socket.io-client";
const SOCKET_URL = "/graphql";
export const socket = io(SOCKET_URL);

const Channel = ({ userChannels, user }) => {
  let [currentChat, setCurrentChat] = useState([]);
  let [currentChannel, setCurrentChannel] = useState(undefined);
  let [allChat, setAllChat] = useState({});
  let [newMessage, setNewMessage] = useState({});
//   let { socket } = useContext(AppContext);
  const textBox = useRef(null);

  useEffect(() => {
    if (socket) {
		console.log(socket)
		console.log("YESLORD")
      socket.on("message", (message) => {
        console.log(message);
        setNewMessage(message);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (newMessage.channelId) {
      console.log(newMessage);
      let { channelId } = newMessage;
      setAllChat((prevChat) => {
        console.log(newMessage);
        let newMaal = newMessage;
        let tempObj = prevChat;
        let tempArr = tempObj[channelId];
        tempArr.push(newMaal);
        prevChat[channelId].push(newMaal);
        console.log(prevChat);
        return prevChat;
      });
    }
  }, [newMessage]);

  useEffect(() => {
    console.log("haa ji hume bulayagaya hai");
    setCurrentChat(allChat[currentChannel]);
  }, [allChat, currentChannel]);

  //Looks like this is for change in channels or user
  useEffect(() => {
    async function fetchData(userChannels) {
      let allChatTemp = {};
      for (let i = 0; i <= userChannels.length - 1; i++) {
        try {
          allChatTemp[userChannels[i]._id] = userChannels[i].messages;
        } catch (e) {
          console.log(e);
        }
      }
      setAllChat(allChatTemp);
    }
    if (userChannels !== undefined) {
      fetchData(userChannels);
    }
  }, [userChannels]);

  useEffect(() => {
    console.log(allChat);
  }, [allChat]);

  useEffect(() => {
    console.log(currentChat);
  }, [currentChat]);

  const sendMessage = (messageBody) => {
	  console.log(messageBody)
    socket.emit("message", {
      channelId: currentChannel,
      message: messageBody,
      user: user,
    });
  };

  const mapper = (chat) => {
    // console.log(chat);
    return chat.map((message) => {
      return (
        <div key={message._id}>
          <div>
            <p>{message.message}</p>
          </div>
          <div>
            <p> by {message.user.userName}</p>
          </div>
        </div>
      );
    });
  };

  const channelMap = () => {
    return userChannels.map((channel) => {
      return (
        <div key={channel._id}>
          <button
            onClick={() => {
              setCurrentChannel(channel._id);
            }}
          >
            {channel.displayName}
          </button>
        </div>
      );
    });
  };
  let chat = currentChat && mapper(currentChat);
  return (
    <div>
      {userChannels && channelMap()}
      <p>Current: {currentChannel}</p>
      {currentChannel && currentChannel === "625a7709f1a9ebce0e4d043f" ? (
        <p>maaaaaaa</p>
      ) : (
        <p>baaaaaap</p>
      )}
      {chat}

      {/* {currentChat && (
				<div key={currentChat[3]._id}>
					<div>
						<p>{currentChat[3].message}</p>
					</div>
					<div>
						<p> by {currentChat[3].user.userName}</p>
					</div>
				</div>
			)} */}
      <form
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(textBox.current.value);
          textBox.current.value = "";
        }}
      >
        <div>
          <input ref={textBox} placeholder="Enter message here"></input>
        </div>
        <button>Send</button>
      </form>
    </div>
  );
  // return <p>hi</p>;
};;

export default Channel;
