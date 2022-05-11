import React from "react";
import queries from "../queries";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import logo from "../img/inTouch.png";
import { useNavigate } from "react-router";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Badge from "@mui/material/Badge";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

// import ArrowDropDownCircleTwoToneIcon from '@mui/icons-material/ArrowDropDownCircleTwoTone';

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

  return (
    <NavbarContainer>
      <NavbarLeft>
        {/* <img src={logo} className="App-logo" alt="inTouch Logo" /> */}
        {props.showSideBar && !props.Sidebar && (
          <div
            className="sidebar-toggle"
            onClick={() => {
              setSidebar(true);
            }}
          >
            {/* <i className="fa fa-bars"></i> */}
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
            {/* <i className="fa fa-bars"></i> */}
            <CloseOutlinedIcon style={styles.largeIcon} />
          </div>
        )}

        {/* 
          <div className="sidebar-toggle" 
        onClick={()=>{
          setSidebar(false);
        }}
        >
         <i className="fa-solid fa-xmark"></i>
          </div> */}
      </NavbarLeft>
      <NavbarSearch>
        <form
          action="#"
          onSubmit={(e) => {
            const s = document.getElementById("searchInput").value;
            e.preventDefault();
            if (s == null || s == "" || s.trim() == "") return;
            setBody("search");
            setSearchTerm(s);
            navigate("/main");
          }}
        >
          <input
            id="searchInput"
            placeholder="Search here"
            className="align-left"
          ></input>
        </form>
        <SearchIcon />
      </NavbarSearch>

      <NavbarRight>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <DropdownButton
            id="dropdown-basic-button"
            className="drop"
            variant="default"
            size="sm"
            title={
              <NavbarAvatar src={props.user.profilePicture} alt={"no img"} />
            }
          >
            <div>
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
                Profile
              </Dropdown.Item>
            </div>
            <div>
              <Dropdown.Item
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userId");
                  navigate("/login");
                }}
              >
                Logout
              </Dropdown.Item>
            </div>
          </DropdownButton>
        </StyledBadge>
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
  position: fixed;
  align-items: flex-end;
  /* margin-left: 200px; */
  right: 20px;
  .drop {
    bottom: 8px;
    right: 20px;
  }
`;

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

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    top: 34,
    marginRight: "28px",
    // marginTop:"15px",
    right: -1,
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
