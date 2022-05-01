import React from 'react'
import styled from 'styled-components'
import StarBorderIcon from '@mui/icons-material/StarBorder';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Button } from '@material-ui/core';


const styles = {

	largeIcon: {
	  width: 40,
	  height: 32,
    
	},
  
  };


function Chat(props) {

    const sendMessage = (e)=>{

        e.preventDefault();

    }

    const setChannel = (channel) => {
		props.setCurrentChannel(channel);
	};

  return (
    
    <ChannelContainer>
        
        <Header>
        <HeaderLeft>
        <StarBorderIcon style={styles.largeIcon}/>
        <h4><strong>{props.currentChannel}</strong></h4>
        
      

        </HeaderLeft>
        <HeaderRight>
        
        <p>
        <InfoOutlinedIcon style={styles.largeIcon}/>
            Details
        </p>
        </HeaderRight>
        </Header>

        <ChannelMessages>
        
        </ChannelMessages>



        <ChannelInput>
        
        <form>
            <input placeholder='Send text in # '/>
            <Button type='submit' hidden onClick={sendMessage}>
                Send
            </Button>

        </form>

        </ChannelInput>


        </ChannelContainer>
   
  )
}

export default Chat

const  ChannelMessages  = styled.div`

    
` 
const  ChannelInput  = styled.div`

border-radius: 20px;

>form {
    position: relative;
    display: flex;
    justify-content: center;
}
>form >input {
    position: fixed;
    bottom: 30px;
    width: 60%;
    border: 1px solid black;
    border-radius: 3px;
    padding: 20px;
    outline: none;
    
}
    
`


const  HeaderLeft  = styled.div`
display: flex;
>h4 {
    display: flex;
    margin-left: 10px;
   
}
/* >h4 >.MuiSvgIcon-root{
    margin-left: 5%;
    font-size: 30px;
    width: 50;
    height: 50;
} */

` 
const  HeaderRight  = styled.div`

    display: flex;
    >p{
        display: flex;
        align-items: center;
        font-size: 20px;
    }
` 

const  Header  = styled.div`
display: flex;
justify-content: space-between;
padding: 20px;
border-bottom: 1px solid lightgray;

` 

const  ChannelContainer = styled.div`
flex:0.7%;
flex-grow: 1;
overflow-y: scroll;
margin-top: 4%;

` 