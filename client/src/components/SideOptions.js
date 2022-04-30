import React from "react";
import styled from "styled-components";
import queries from "../queries";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

function SideOptions({Icon,title}) {
  
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
  
  
    return (
      
    <>
    <OptionContainer>
        {Icon && <Icon fontSize='large' style={{padding:10}}/>}
        {Icon ? (
            <h3>{title}</h3>
        ):(
            <OptionChannel>
                <span>#</span>{title}
            </OptionChannel>
        )}
    </OptionContainer>
    </>
  )
}

export default SideOptions;


const OptionContainer = styled.div`
display: flex;
font-size: 12px;
align-items: center;
padding-left:2px;
cursor: pointer;

:hover {
    opacity:0.9;
    background-color: var(--intouch-color);
}

> h3 {
    font-weight: 100;
}
>h3 > span {
    padding: 15px;
}
`

const OptionChannel = styled.h3`

padding: 10px 0;
font-weight: 300;


`