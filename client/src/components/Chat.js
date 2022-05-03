import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Button } from "@material-ui/core";
import SendIcon from "@mui/icons-material/Send";
import queries from "../queries";
const styles = {
  largeIcon: {
    width: 40,
    height: 32,
  },
  largerIcon: {
    width: 40,
    height: 40,
  },
};

function Chat(props) {
  const textBox = useRef(null);
  console.log(props);
  const [currentChannel, setCurrentChannel] = useState(props.currentChannel);

  //   const { data, loading, error } = useSubscription(
  //     queries.channel.SUBSCRIBE_MESSAGE,
  //     {
  //       variables: {
  //         channelId: props.currentChannel._id,
  //       },
  //     }
  //   );

  useEffect(() => {
    setCurrentChannel(props.currentChannel);
  }, [props]);

  //   if (data) {
  //     console.log(data);
  //   }
  //   if (error) {
  //     console.log(error);
  //   }

  //REFRESHING CHANNEL ON NEW MESSAGE
  //   useEffect(() => {
  //     if (data) setCurrentChannel(data.channel);
  //   }, [data]);

  //SENDING MESSAGE
  const [addMessage] = useMutation(queries.channel.ADD_MESSAGE);

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

  let chat =
    currentChannel &&
    currentChannel.messages &&
    mapper(currentChannel.messages);
  return (
    <ChannelContainer>
      <Header>
        <HeaderLeft>
          <StarBorderIcon style={styles.largeIcon} />
          <h4>
            <strong>{currentChannel.name}</strong>
          </h4>
        </HeaderLeft>
        <HeaderRight>
          <p>
            <InfoOutlinedIcon style={styles.largeIcon} />
            Details
          </p>
        </HeaderRight>
      </Header>

      <ChannelMessages>{chat}</ChannelMessages>

      <ChannelInput>
        <form
          method="POST"
          onSubmit={(e) => {
            e.preventDefault();
            addMessage({
              variables: {
                channelId: currentChannel._id,
                // user: props.user,
                message: textBox.current.value,
              },
            });
            textBox.current.value = "";
          }}
        >
          <input
            placeholder={`Send text in ${currentChannel.name}`}
            ref={textBox}
          />
          <div>
            {/* <SendIcon style={styles.largerIcon} /> */}
            <button className="fa fa-paper-plane" type="submit"></button>
          </div>
        </form>
      </ChannelInput>
    </ChannelContainer>
  );
}

export default Chat;

const ChannelMessages = styled.div`
margin-bottom: 17%;:`;
const ChannelInput = styled.div`
  border-radius: 20px;

  > form {
    position: relative;
    display: flex;
    justify-content: center;
  }
  > form > input {
    position: fixed;
    bottom: 30px;
    width: 60%;
    border: 1px solid black;
    border-radius: 3px;
    padding: 20px;
    outline: none;
  }
  > form > div {
    position: fixed;
    bottom: 30px;

    margin-left: 56%;
    /* border-radius: 2px; */
    padding: 0.9%;
    outline: none;
  }
  /* >form>div >button {
    position: fixed;
    bottom: 30px;

    
    border: 1px solid black;
    border-radius: 3px;
    padding: 1.25%;
    outline: none;
    
} */
`;

const HeaderLeft = styled.div`
  display: flex;
  > h4 {
    display: flex;
    margin-left: 10px;
  }
  /* >h4 >.MuiSvgIcon-root{
    margin-left: 5%;
    font-size: 30px;
    width: 50;
    height: 50;
} */
`;
const HeaderRight = styled.div`
  display: flex;
  > p {
    display: flex;
    align-items: center;
    font-size: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid lightgray;
`;

const ChannelContainer = styled.div`
  flex: 0.7%;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 4%;
`;
