import React from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import logo from "../img/logoNav(no-text).png";
import { useNavigate } from "react-router";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Badge from "@mui/material/Badge";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import LogoutIcon from '@mui/icons-material/Logout';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

const styles = {
  largeIcon: {
    width: 35,
    height: 40,
  },
};

function Navbar(props) {
  const navigate = useNavigate();

  const setBody = (type) => {
    props.setCurrentBody(type);
  };
  const setSidebar = (type) => {
    props.showSideBar(type);
  };

  const setSearchTerm = (searchTerm) => {
    props.setSearchTerm(searchTerm);
  };

  function handleSubmit(e) {
    e.preventDefault();
    const s = document.getElementById("searchInput").value;
    if (s == null || s == "" || s.trim() == "") return;
    setBody("search");
    setSearchTerm(s);
    navigate("/main");
    document.getElementById("searchInput").value = "";
  }

  return (
    <NavbarContainer>
      <NavbarLeft>
        <img src={logo} className="App-logo" alt="inTouch Logo" />
        {props.showSideBar && !props.Sidebar && (
          <div
            className="sidebar-toggle"
            onClick={() => {
              setSidebar(true);
            }}
          >
            <MenuOutlinedIcon style={styles.largeIcon} />
          </div>
        )}

        {props.showSideBar && props.Sidebar && (
          <div
            className="sidebar-toggle"
            onClick={() => {
              setSidebar(false);
            }}
          >

            <CloseOutlinedIcon style={styles.largeIcon} />
          </div>
        )}

      </NavbarLeft>
      <NavbarSearch>
        <form action="#" id="searchForm" onSubmit={handleSubmit}>
          <input
            aria-label="Back"
            id="searchInput"
            placeholder="Search here"
            className="align-left"
          ></input>
        </form>
        <SearchIcon onClick={handleSubmit} />
      </NavbarSearch>

      <NavbarRight>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        ></StyledBadge>
          <DropdownButton
            id="dropdown-basic-button"
            className="drop"
            variant="default"
            size="sm"
            title={
              <NavbarAvatar src={props.user.profilePicture} alt={"no img"} />
            }
          >
            
              <Dropdown.Item
                onClick={() => {
                  setBody("feed");
                  setBody("user");
                  navigate("/profile", {
                    state: {
                      prevLocation: window.location.pathname,
                      prevElement: props.currentBody,
                    },
                  });
                }}
              >
                <span className="drop3"><PermIdentityIcon  /></span>
                <span className="drop1">Profile</span>
              </Dropdown.Item>
            
              <Dropdown.Item
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userId");
                  navigate("/login");
                }}
              >
                <span className="drop3"><LogoutIcon  /></span>
                
                <span className="drop1">Logout</span>
                
              </Dropdown.Item>
           
          </DropdownButton>
        
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
  > img {
    margin-top: 75px;
    height: 173px;
    width: 170px;
    @media (max-width: 991px) {
      margin-top: 28px;
      margin-left: 0px;
      margin-right: 10px;
      height: 113px;
      width: 110px;
    }
    @media (max-width: 480px) {
      margin-top: 1px;
      margin-left: 0px;
      margin-right: 0px;
      height: 73px;
      width: 70px;
    }
  }
`;

const NavbarRight = styled.div`
  flex: 0.3;
  display: flex;
  position: fixed;
  align-items: flex-end;
  right: 20px;
  .drop {
    bottom: 0px;
    right: 20px;
  }
  .drop1 {
    padding: 10px;
    margin-left: 5px;
  }
  .drop3 {
    margin-left: 12px;
  }
  @media (max-width: 480px) {
    right: 0px;
  }
`;

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    top: -17,
    marginRight: "0px",
    right: -50,
    color: "#44b700",
    boxShadow: `0 0 0 2px `,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
}));

const NavbarSearch = styled.div`
  flex: 0.5;
  margin-right: 31%;

  opacity: 1;
  border-radius: 6px;
  background-color: var(--intouch-color);
  align-items: center;
  display: flex;
  padding: 2px 25px;
  color: white;
  border: 1px white solid;
  > form > input {
    background-color: transparent;
    border: none;
    text-align: left;
    min-width: 30vw;
    outline: 0;
    color: white;
    ::placeholder {
      color: white;
      text-align: left;
      padding: 0 0;
    }
    @media (max-width: 480px) {
      max-width: 3vw;
    }
  }
`;
const NavbarContainer = styled.div`
  display: flex;
  height: 74px;
  position: fixed;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  background-color: var(--intouch-color);
  color: white;
  z-index: 999;
`;

const NavbarAvatar = styled(Avatar)`
  cursor: pointer;
  margin-left: auto;
  margin-right: 20px;
  :hover {
    opacity: 0.8;
  }
`;


