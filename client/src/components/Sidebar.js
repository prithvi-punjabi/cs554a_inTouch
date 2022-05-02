import React,{useState,useEffect} from "react";
import styled from "styled-components";
import SideOptions from "./SideOptions";
// import InboxIcon from "@material-ui/icons"

import InboxIcon from '@mui/icons-material/Inbox';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';

import queries from "../queries";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";

function Sidebar(props) {
	
	const navigate = useNavigate();

	  let userId = localStorage.getItem("userId")

      
  const { loading, error, data } = useQuery(queries.user.GET_BY_ID, {
    variables: {
      userId: userId,
    },
    errorPolicy: "all",
    onError: (error) => {
      console.log(error);
    },
  });




	const [showChannels, setshowChannels] = useState(false);
	

	const setBody = (type) => {
		props.currentBody(type);
	};

	const setChannel = (channel) => {
		props.setChannel(channel);
	};

	

	const channelMap = () =>{
		return (
			data.getUser.courses?.map((ch)=>(
					
				<div
				onClick={() => {
					setBody("channel");
				}}>
					<SideOptions  title = {ch.code}/>
				</div>
			
				
			))
		)
	}

		// let channels = channelMap()
	
	
		return (
			<SidebarContainer>
				<Sidebarheader>
					<Sidebarinfo>
						<h2>Nirav Patel</h2>
					</Sidebarinfo>
				</Sidebarheader>
				<hr />
				
				<div  
					onClick={() => {
						setBody("feed");
						navigate("/main")
					}}
				>
					<SideOptions Icon = {InboxIcon} title = "Feed" />
				</div>
			
				{/* <SideOptions Icon = {ExpandLessIcon} title = "Show less"/> */}
				<hr />
				
				
				{/* <SideOptions Icon = {AddIcon} title = "Add Channels"/> */}
				
				{showChannels && 
				<div onClick={()=>{setshowChannels(!showChannels);
					navigate('/main')}}>
				
				<SideOptions Icon = {ArrowDropDownIcon} title = "Channels"/>
				<div>
					{/* {channelMap()} */}
				</div>
				</div>
				
				
				}

				{!showChannels && 
				<div onClick={()=>{setshowChannels(!showChannels)}}>
				
				<SideOptions Icon = {ArrowRightOutlinedIcon} title = "Channels"/>
				</div>}

				{showChannels && data.getUser.courses?.map((ch)=>(
					
					<div
					onClick={() => {
						setBody("channel");
						setChannel(ch.code)
						navigate('/main')
					}} key={ch.code}>
						<SideOptions  title = {ch.code} />
					</div>
				
					
				))}
			<hr/>
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

	>hr {
		margin-top: 10px;
		margin-bottom: 10px;
		border:1px solid var(--intouch-color1);
	}
	>ul {
		
		margin: 0;
		padding: 0;
		user-select: none;
		box-sizing: border-box;
	}
	>ul >li {
		
		margin: 0;
		padding: 0;
		user-select: none;
		box-sizing: border-box;
	}
	>ul >li >ul {
		
		margin: 0;
		padding: 0;
		user-select: none;
		box-sizing: border-box;
		
	}
	>ul >li >ul >li{
		
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
