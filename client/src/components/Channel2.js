import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import queries from "../queries";
import { MediaStoreData } from "aws-sdk";
const Channel2 = ({ userChannels, user }) => {
  //   console.log(userChannels, user);
  const textBox = useRef(null);
  //   const {data:channelData , loading: channelLoading} = useQuery(queries.channel.GET_BY_ID,{
  //     variables: {
  //         userId: userId,
  //       },
  //   })

  //STATES
  let [currentChannel, setCurrentChannel] = useState(undefined);
  let [currentChat, setCurrentChat] = useState([]);

  const { data, loading, error } = useSubscription(
    queries.channel.SUBSCRIBE_MESSAGE,
    {
      variables: {
        channelId: userChannels[0]._id,
      },
    }
  );

  useEffect(() => {
    if (data) {
      setCurrentChat(data.channel.messages);
    }
  }, [data]);

  //SENDING MESSAGE
  const [addMessage] = useMutation(queries.channel.ADD_MESSAGE);

  if (data) {
    console.log(data);
  }
  if (error) {
    console.log(error);
  }

  //POPULATOR FUNCTIONS
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

  let chat = currentChat && mapper(currentChat);
  return (
    <div>
      {chat}
      <form
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
          addMessage({
            variables: {
              channelId: userChannels[0]._id,
              user: user,
              message: textBox.current.value,
            },
          });
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
};

export default Channel2;
