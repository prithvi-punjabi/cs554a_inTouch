import React from "react";
import queries from "../queries";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import logo from "../img/inTouch.png";
import { useNavigate } from "react-router";
// import ArrowDropDownCircleTwoToneIcon from '@mui/icons-material/ArrowDropDownCircleTwoTone';

function Navbar() {
  const navigate = useNavigate();
  return (
    <NavbarContainer>
      <NavbarLeft>
        {/* <img src={logo} className="App-logo" alt="inTouch Logo" /> */}
      </NavbarLeft>
      <NavbarSearch>
        <SearchIcon />
        <input placeholder="Search here"></input>
      </NavbarSearch>

      <NavbarRight>
        <NavbarAvatar
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/login");
          }}
        />
      </NavbarRight>
    </NavbarContainer>
  );
}

export default Navbar;

const NavbarLeft = styled.div`
  flex: 0.3;
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

const NavbarRight = styled.div`
  flex: 0.3;
  display: flex;
  align-items: flex-end;
  margin-left: 20px;
`;

const NavbarSearch = styled.div`
  flex: 0.4;
  opacity: 1;
  border-radius: 6px;
  background-color: var(--intouch-color);

  display: flex;
  padding: 2px 25px;
  color: white;
  border: 1px white solid;
  > input {
    background-color: transparent;
    border: none;
    text-align: center;
    min-width: 30vw;
    outline: 0;
    color: white;
    ::placeholder {
      color: white;
      text-align: center;
      padding: 0 0;
    }
  }
`;
const NavbarContainer = styled.div`
  display: flex;
  height: 8.2%;
  position: fixed;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  background-color: var(--intouch-color);
  color: white;
`;

const NavbarAvatar = styled(Avatar)`
  cursor: pointer;

  align-items: right;
  margin-left: auto;
  margin-right: 20px;
  :hover {
    opacity: 0.8;
  }
`;
