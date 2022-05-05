import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Button } from "@material-ui/core";
import SendIcon from "@mui/icons-material/Send";
import queries from "../queries";
import useTextToxicity from "react-text-toxicity";
import Swal from "sweetalert2";
import { predictor } from "../helper";
const styles = {
  largeIcon: {
    width: 40,
    height: 32,
  },
  largerIcon: {
    width: 50,
    height: 50,
  },
};

function Chat(props) {
  const messageRef = useRef(null);
  const textBox = useRef(null);
  console.log(props);
  const [message, setMessage] = useState("");
  const [currentChannel, setCurrentChannel] = useState(props.currentChannel);
  const model = useRef();
  useEffect(() => {
    messageRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [props,currentChannel]);
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
      let days = Math.floor(
        (new Date() - new Date(message.dateCreated)) / (1000 * 3600 * 24)
      );
      let date = new Date(message.dateCreated);
      let time = date.toTimeString();
      let dateTime = date.toLocaleString();

      let h = date.getHours(),
        m = date.getMinutes();
      time = h > 12 ? h - 12 + ":" + m + " PM" : h + ":" + m + " AM";

      date = date.toDateString();

      return (
        <ChannelMessagesContainer key={message._id}>
          <img src={message.user.profilePicture}></img>

          <MessageInfo>
            <h5>
              {message.user.userName}
              <span>
                {" "}
                {days === 0 && <small className="mr-2">Today, {time}</small>}
                {days === 1 && (
                  <small className="mr-2">Yesterday, {time}</small>
                )}
                {days > 1 && (
                  <small className="mr-2">
                    {date}, {time}
                  </small>
                )}
              </span>
            </h5>

            <MessageDetail>
              <p>{message.message}</p>
            </MessageDetail>
          </MessageInfo>
        </ChannelMessagesContainer>
      );
    });
  };
  const predictions = useTextToxicity(message);
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
            <strong>{currentChannel.displayName}</strong>
          </h4>
        </HeaderLeft>
        <HeaderRight>
          <p>
            <InfoOutlinedIcon style={styles.largeIcon} />
            Details
          </p>
        </HeaderRight>
      </Header>

      <ChannelMessages>
        {chat}
        <MessageBottom ref={messageRef} />
        <MessageCover  />
      </ChannelMessages>

      <ChannelFooter>
        <ChannelInput>
          <form
            method="POST"
            onSubmit={async (e) => {
              e.preventDefault();
              const predictions = await predictor(textBox.current.value, model);
              let isToxic = false;
              if (predictions) {
                predictions.forEach((x) => {
                  if (x.match === true) {
                    isToxic = true;
                    if ((x.label = "toxicity")) x.label = "toxic";
                    Swal.fire({
                      title: "Toxic Text Detected!",
                      text: `Your message has been labelled ${x.label} with a probability of ${x.probability}. You send post it.`,
                      icon: "error",
                      confirmButtonText: "I'm sorry!",
                    });
                  }
                });
              }
              if (isToxic == false) {
                addMessage({
                  variables: {
                    channelId: currentChannel._id,
                    // user: props.user,
                    message: textBox.current.value,
                  },
                });

                textBox.current.value = "";
              }
            }}
          >
            <input
              placeholder={`Send text in ${currentChannel.name}`}
              ref={textBox}
            />
            <div>
              <Button type="submit">
                {" "}
                <SendIcon style={styles.largerIcon} />
              </Button>
            </div>
          </form>
        </ChannelInput>
      </ChannelFooter>
    </ChannelContainer>
  );
}

export default Chat;

const MessageCover = styled.div`
  padding-bottom: 100px;
  margin-right: 10%;
  background-color: white;
  position: fixed;
   left: 0;
   bottom: 0;
   width: 90%;
   color: white;
   text-align: center;
  
`;

const MessageBottom = styled.div`
  padding-bottom: 100px;
`;

const ChannelMessagesContainer = styled.div`
  display: flex;
  /* align-items: center; */

  padding: 10px;
  background-color: white;
  border: 0px solid lightgray;
  border-radius: 20px;
  margin-bottom: 10px;
  > img {
    height: 60px;
    border-radius: 8px;
  }
`;

const MessageInfo = styled.div`
  padding-left: 10px;
  align-items: left;
  text-align: left;
  > h5 > span {
    color: gray;
    font-weight: 300;
    margin-left: 14px;
    font-size: 14px;
  }

  p > {
  }
`;
const MessageDetail = styled.div`
  float: left;
`;
const ChannelMessages = styled.div`
  padding: 5px;
  margin-top: 110px;
  margin-left: 20px;
  /* display: flex; */
  /* text-align: left; */
`;
const ChannelFooter = styled.div`
  padding-right: 100px;
  background-color: black;
`;

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
    
    @media (max-width:991px) {
      margin-left: 100px;
      width: 90%;
  }
    
  }

  > form > div {
    position: fixed;
    bottom: 30px;

    /* margin-left: 1085px; */
    margin-left: 56.5%;
    /* border-radius: 2px; */
    padding: 0.1%;
    outline: none;
    @media (max-width:991px) {
      right:6.1%
  }
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
  position: fixed;
  display: flex;

  > h4 {
    display: flex;
    /* margin-left: 10px; */
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
  position: fixed;

  align-items: right;
  /* margin-left: 75%; */
  right: 20px;
  > p {
    display: flex;
    align-items: center;
    font-size: 20px;
  }
  @media (max-width:991px) {
  
    display: none;

}
`;

const Header = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  justify-content: space-between;
  padding: 50px;
  border-bottom: 1px solid lightgray;
  background-color: white;
  
  @media (max-width:991px) {
    padding-left: 10px;

  }
`;

const ChannelContainer = styled.div`
  flex: 0.7;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 49px;
`;
