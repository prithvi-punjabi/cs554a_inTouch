import React, {useState} from "react";
import styled from "styled-components";
import queries from "../queries";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const styles = {

	largeIcon: {
	  width: 70,
	  height: 55,
	  padding:10 
	},
  
  };

function SideOptions({Icon,title,read}) {
	
	const [readZero, setReadZero] = useState([]);
	let reading = false 
	const reader = () =>{
			
	}
	if(read >0){
		reading = true
	}

	return (
	  
	<OptionContainer>
		{Icon && <Icon style={styles.largeIcon} />}
		{Icon ? (
			<h3>{title}</h3>
		):(
			
			<OptionChannel>
				
				<span>#</span>{title}{ reading &&(<div className="span1">{read}</div>)}
				
			</OptionChannel>
		
			
		)}
	</OptionContainer>

  )
}

export default SideOptions;


const OptionContainer = styled.div`
display: flex;

align-items: center;
padding-left:2px;
cursor: pointer;

:hover {
	opacity:0.9;
	background-color: var(--intouch-color);
}

> h3 {
	font-size:x-large;
	font-weight: 400;
}
>h3 > span {
	padding: 15px;
}
`

const OptionChannel = styled.h3`

display: flex;
padding: 0px 0;
font-weight: 300;
align-items: center;

>div {
	border: 1px solid #44b6fc;
	background-color: #44b6fc;
	border-radius: 100%;
	text-align: center;
	width: 30px;
	position: absolute;
	left: 260px;
	color: black;
	height: 30px;
	font-size: 20px;
}




`