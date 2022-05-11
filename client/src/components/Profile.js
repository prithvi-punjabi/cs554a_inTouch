import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import queries from "../queries";
import Swal from "sweetalert2";
import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Button } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import { isLoggedIn } from "../helper";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import {
  Card,
  CardActions,
  CardContent,
  CardMedia
 
} from "@mui/material";
import styled from "styled-components";

const useStyles = makeStyles({
  container: {
    height: "100px",
    // width: "100%"
  },
  outerContainer: {
    position: "absolute",
    height: "100%",
    width: "80%",
  },
  outerContainerUpparLayer: {
    height: "80%",
    background:
      "linear-gradient(90deg, rgba(163,38,56,1) 0%, rgba(122,29,43,1) 100%);",
  },
  outerContainerInnerLayer: {
    height: "20%",
    background: "#f0f0f0",
  },
  profileCard: {
    position: "absolute",
    borderRadius: "10px",
    background: "white",
    height: "650px",
    width: "70%",
    margin: "160px 100px",
    boxShadow: "2px 10px 30px grey",
  },
  profilePicture: {
    objectFit: "cover",
    objectPosition: "center",
    width: "40%",
    height: "80%",
    position: "absolute",
    top: "10%",
    borderRadius: "10px",
    left: "5%",
  },
  detailsContainer: {
    padding: "10px 20px",
    textAlign: "left",
    overflowY: "auto",
    height: "90%",
  },
});
const styles = {
  largeIcon: {
    width: 50,
    height: 50,
  },
};

const Profile = (props) => {
  let navigate = useNavigate();
  const location = useLocation();

  const params = useParams();
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, []);
  const classes = useStyles();
  let thisUserId = localStorage.getItem("userId");
  let userId =
    location.pathname == "/profile"
      ? localStorage.getItem("userId")
      : params.userId;
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [fetchUser] = useLazyQuery(queries.user.GET_BY_ID, {
    variables: {
      userId: userId,
    },
    errorPolicy: "all",
    onError: (error) => {
      console.log(error);
    },
  });
  const [addFriend] = useMutation(queries.user.ADD_FRIEND);
  const [removeFriend] = useMutation(queries.user.REMOVE_FRIEND);

  function refetchUser() {
    fetchUser({ variables: { userId: userId } }).then(({ data }) => {
      setUser(data.getUser);
    });
  }
  const setBody = (type) => {
    props.setCurrentBody(type);
  };

  useEffect(() => {
    refetchUser();
  }, []);

  async function handleAddFriend() {
    try {
      const { data } = await addFriend({
        variables: {
          friendId: userId,
        },
      });
      setUser(data.addFriend);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleRemoveFriend() {
    try {
      const { data } = await removeFriend({
        variables: {
          friendId: userId,
        },
      });
      setUser(data.deleteFriend);
    } catch (e) {
      console.log(e);
    }
  }
  

  if (user) {
    let currUserId = localStorage.getItem("userId");
    return (
      <>
        
        {!props.showCardProfile && 
        (<div className={classes.container}>
          <div className={classes.outerContainer}>
          <div className={classes.outerContainerUpparLayer}></div>
          <div className={classes.outerContainerInnerLayer}></div>
        </div>
          <div className={classes.profileCard}>
          <br></br>
          {location.state !== null && (
            <Button
              onClick={() => {
                if (location.state.prevLocation === "/channel/members") {
                  console.log(props);
                  navigate(location.state.prevLocation, {
                    state: {
                      currChan: location.state.currChan
                        ? location.state.currChan
                        : props.currentChannelId,
                    },
                  });
                } else {
                  navigate(location.state.prevLocation);
                }
                setBody(location.state.prevElement);
              }}
              style={{ position: "absolute", right: "20px" }}
            >
              <CloseOutlinedIcon style={styles.largeIcon} />
            </Button>
          )}
          {location.state === null && (
            <Button
              onClick={() => {
                setBody("feed");
                navigate("/main");
              }}
              style={{ position: "absolute", right: "20px" }}
            >
              <CloseOutlinedIcon style={styles.largeIcon} />
            </Button>
          )}
          <Grid container spacing={0} direction="row">
            <Grid item xs={10} sm={8} md={6} >
              <img
                className={classes.profilePicture}
                src={user.profilePicture}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              className={classes.detailsContainer}
              style={{ textAlign: "center", padding: "10px" }}
            >
              <Grid
                container
                style={{ paddingTop: "50px", alignSelf: "center" }}
              >
                <Grid item xs={6}>
                  <Typography
                    variant="h3"
                    component="h3"
                    style={{ fontWeight: "bold", padding: "10px 0px" }}
                  >
                    {user.name}
                  </Typography>
                </Grid>
                {currUserId != user._id && !user.friends.includes(currUserId) && (
                  <Grid item alignSelf={"center"} marginLeft={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      align="center"
                      onClick={handleAddFriend}
                    >
                      + Add friend
                    </Button>
                  </Grid>
                )}
                {currUserId != user._id && user.friends.includes(currUserId) && (
                  <Grid item alignSelf={"center"} marginLeft={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      align="center"
                      onClick={handleRemoveFriend}
                    >
                      - Unfriend
                    </Button>
                  </Grid>
                )}
              </Grid>
              <Typography
                variant="body1"
                component="span"
                style={{ color: "grey" }}
              >
                {user.bio}
              </Typography>
              <Grid container style={{ padding: "10px 0px" }}>
                <Grid item xs={6} style={{ padding: "0px", width: "50%" }}>
                  <ListItemButton>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={user.userName}
                      style={{ textAlign: "left" }}
                    />
                  </ListItemButton>
                </Grid>
                <Grid item xs={6} style={{ padding: "0px", width: "50%" }}>
                  <ListItemButton>
                    <ListItemIcon>
                      <MailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={user.email}
                      style={{ textAlign: "left" }}
                    />
                  </ListItemButton>
                </Grid>

                {user.contactNo && (
                  <Grid item xs={6} style={{ padding: "0px", width: "50%" }}>
                    <ListItemButton>
                      <ListItemIcon>
                        <PhoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={user.contactNo}
                        style={{ textAlign: "left" }}
                      />
                    </ListItemButton>
                  </Grid>
                )}

                {user.contactNo && (
                  <Grid item xs={6} style={{ padding: "0px", width: "50%" }}>
                    <ListItemButton>
                      <ListItemIcon>
                        <CakeIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={user.dob}
                        style={{ textAlign: "left" }}
                      />
                    </ListItemButton>
                  </Grid>
                )}
              </Grid>

              <Typography
                variant="h6"
                component="span"
                style={{ fontWeight: "bold" }}
              >
                Channels
              </Typography>

              <List>
                {user.courses.map((course) => {
                  return (
                    <ListItem
                      disablePadding
                      style={{ padding: "0px", width: "100%" }}
                    >
                      <ListItemButton>
                        <ListItemText
                          primary={course.code + " " + course.name}
                          style={{ textAlign: "left" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
              {thisUserId === user._id && (
                <button
                  className="btn-lg btn-danger"
                  color="primary"
                  variant="contained"
                  align="center"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              )}
            </Grid>
          </Grid>
        </div>
        </div>
        )
        }
        {props.showCardProfile && (
          
          

          
            <ChannelMembersContainer>
              {location.state !== null && (
            <Button
              onClick={() => {
                if (location.state.prevLocation === "/channel/members") {
                  console.log(props);
                  navigate(location.state.prevLocation, {
                    state: {
                      currChan: location.state.currChan
                        ? location.state.currChan
                        : props.currentChannelId,
                    },
                  });
                } else {
                  navigate(location.state.prevLocation);
                }
                setBody(location.state.prevElement);
              }}
              style={{ position: "absolute", right: "20px" }}
            >
              <CloseOutlinedIcon style={styles.largeIcon} />
            </Button>
          )}
          {location.state === null && (
            <Button
              onClick={() => {
                setBody("feed");
                navigate("/main");
              }}
              style={{ position: "absolute", right: "20px" }}
            >
              <CloseOutlinedIcon style={styles.largeIcon} />
              
            </Button>
          )}
              <MembersContainer>
          <Card
            style={{
              borderRadius: "7px",
              height: "100%",
              width: "100%",
              cursor: "pointer",
            }}
          >
            <CardMedia
              component="img"
              style={{ height: "30vh" }}
              image={user.profilePicture}
              alt={user.name}
              
            />
            <CardContent
              
            >
              <Typography
                style={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                }}
                gutterBottom
                variant="h3"
                component="div"
              >
                {user.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                style={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                }}
              >
                {user.bio}
              </Typography>
            </CardContent>
            <CardActions style={{ justifyContent: "center" }}>

              {currUserId != user._id && !user.friends.includes(currUserId) && (
                  
                    <Button
                      variant="contained"
                      color="primary"
                      align="center"
                      onClick={handleAddFriend}
                    >
                      + Add friend
                    </Button>
     
                )}
                {currUserId != user._id && user.friends.includes(currUserId) && (
                  <Button
                      variant="contained"
                      color="primary"
                      align="center"
                      onClick={handleRemoveFriend}
                    >
                      - Unfriend
                    </Button>
                  
                )}
            </CardActions>
            <Grid container style={{ padding: "10px 0px" }}>
                <Grid item xs={6} style={{ padding: "0px", width: "70%" }}>
                  <ListItemButton>
                    
                      <PersonIcon color="primary" />
                    
                    <ListItemText
                      primary={user.userName}
                      style={{ textAlign: "left" }}
                    />
                  </ListItemButton>
                {/* </Grid>
                <Grid item xs={6} style={{ padding: "0px", width: "70%" }}> */}
                  <ListItemButton>
                    
                      <MailIcon color="primary" />
                    
                    <ListItemText
                      primary={user.email}
                      style={{ textAlign: "left" }}
                    />
                  </ListItemButton>
                </Grid>

                {user.contactNo && (
                  <Grid item xs={6} style={{ padding: "0px", width: "70%" }}>
                    <ListItemButton>
                     
                        <PhoneIcon color="primary" />
                      
                      <ListItemText
                        primary={user.contactNo}
                        style={{ textAlign: "left" }}
                      />
                    </ListItemButton>
                  </Grid>
                )}

                {user.contactNo && (
                  // <Grid item xs={6} style={{ padding: "0px", width: "70%" }}>
                    <ListItemButton>
                     
                        <CakeIcon color="primary" />
                      
                      <ListItemText
                        primary={user.dob}
                        style={{ textAlign: "left" }}
                      />
                    </ListItemButton>
                  // </Grid>
                )}
              </Grid>


              <CardContent
              
            >
              <Typography
                style={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                }}
                gutterBottom
                variant="h5"
                component="div"
              >
               <strong>Channels</strong>
              </Typography>
              <List>
                {user.courses.map((course) => {
                  return (
                    <ListItem
                      disablePadding
                      style={{ padding: "0px", width: "100%" }}
                    >
                      <ListItemButton>
                        <ListItemText
                          primary={course.code + " " + course.name}
                          style={{ textAlign: "left" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
          </MembersContainer>
          </ChannelMembersContainer>
          
        )
        }
        
      </>
    );
  } else if (error) {
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: error,
    }).then(() => {
      navigate(-1);
    });
    return <div>Error</div>;
  } else {
    return <div>Loading...</div>;
  }
};

export default Profile;

const ChannelMembersContainer = styled.div`
  flex: 0.7;
  flex-grow: 1;
 /* height: 100%; */
  margin-top: 120px;
  width: 100%;
  /* display: flex; */
  overflow-y: scroll;
  
  
`;

const MembersContainer = styled.div`
  margin-top: 50px;
  margin-left: 20%;
  margin-right: 20%;
  margin-bottom: 50px;
 
  /*  */
`;
