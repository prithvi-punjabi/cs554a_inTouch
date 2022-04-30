import React from "react";
import styled from "styled-components";
import SideOptions from "./SideOptions";
// import InboxIcon from "@material-ui/icons"

import InboxIcon from '@mui/icons-material/Inbox';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

import queries from "../queries";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

function Sidebar(props) {
    

    const userId = localStorage.getItem("_id");
    const userName = localStorage.getItem("userName");

    let channels = ["one","two","three"]

    // let user = {
    //     _id
    // }
    const setBody = (type) => {
        props.currentBody(type);
    };
    return (
        <SidebarContainer>
            <Sidebarheader>
                <Sidebarinfo>
                    <h2>Nirav Patel</h2>
                </Sidebarinfo>
            </Sidebarheader>
            <hr />
            
            <button className="btn-lg btn-danger" 
                onClick={() => {
                    setBody("feed");
                }}
            >
                Feed
            </button>
            <hr />
            
            <br></br>
            <SideOptions Icon = {InboxIcon} title = "Feed"/>
            <SideOptions Icon = {ExpandLessIcon} title = "Show less"/>
            <hr/>
            <SideOptions Icon = {ExpandMoreIcon} title = "Channels"/>
            <hr/>
            {/* <SideOptions Icon = {AddIcon} title = "Add Channels"/> */}

            {channels?.map((ch)=>(
                <SideOptions  title = {ch}/>
            ))}
        </SidebarContainer>
    );
}

export default Sidebar;

const SidebarContainer = styled.div`
    background-color: var(--intouch-color1);
 
    flex: 0.3;
    border-top: 1px solid var(--intouch-color1);
    max-width: 260px;
    margin-top: 3.9%;

    color: white;

    >hr {
        margin-top: 10px;
        margin-bottom: 10px;
        border:1px solid var(--intouch-color1);
    }

`;

const Sidebarheader = styled.div`
    /* display: flex; */
        
    border-bottom: 1px solid var(--intouch-color1);
    padding-top: 15px;
`;

const Sidebarinfo = styled.div`
    /* flex: 1; */

`;
