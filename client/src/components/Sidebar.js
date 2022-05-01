import React,{useState} from "react";
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
	

	// const userId = localStorage.getItem("userId");
	// // const userName = localStorage.getItem("userName");
	// console.log(userId)

	// const { loading, error, data } = useQuery(queries.channel.GET, {
		
	// 	variables:{userId:userId}
	//   });

	// if (data){
	// 	console.log("channels ")
	// 	console.log(data)
	// }
	// if (error){
	// 	console.log("error  ")
	// 	console.log(error)
	// }


	const [showChannels, setshowChannels] = useState(false);
	console.log(showChannels)

	const setBody = (type) => {
		props.currentBody(type);
	};

	// temp data for channels

	  const userArray = 
		
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
		}
	  ;


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
					}}
				>
					<SideOptions Icon = {InboxIcon} title = "Feed" />
				</div>
			
				{/* <SideOptions Icon = {ExpandLessIcon} title = "Show less"/> */}
				<hr />
				
				
				{/* <SideOptions Icon = {AddIcon} title = "Add Channels"/> */}
				
				{showChannels && 
				<div onClick={()=>{setshowChannels(!showChannels)}}>
				
				<SideOptions Icon = {ArrowDropDownIcon} title = "Channels"/>
				</div>
				
				
				}

				{!showChannels && 
				<div onClick={()=>{setshowChannels(!showChannels)}}>
				
				<SideOptions Icon = {ArrowRightOutlinedIcon} title = "Channels"/>
				</div>}

				{showChannels && userArray.courses?.map((ch)=>(
					
					<div
					onClick={() => {
						setBody("channel");
					}}>
						<SideOptions  title = {ch.code}/>
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
