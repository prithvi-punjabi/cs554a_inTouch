import { useQuery, useMutation } from "@apollo/client";
import React from "react";
import queries from "../queries";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import "../App.css";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { CircularProgress } from "@mui/material";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Button } from "@material-ui/core";
import Swal from "sweetalert2";

const styles = {
  largeIcon: {
    width: 40,
    height: 32,
  },
  largerIcon: {
    width: 50,
    height: 50
  },
};

const ChannelDeets = (props) => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  console.log(location.state.currChan);
  const { loading, error, data } = useQuery(queries.channel.GET_USERS, {
    variables: { getUsersForChannelId: location.state.currChan },
  });

  const setBody = (type) => {
    props.setCurrentBody(type);
  };

  const {
    loading: cLoading,
    error: cError,
    data: cData,
  } = useQuery(queries.channel.GET_BY_ID, {
    variables: { channelId: location.state.currChan },
  });

  const userId = localStorage.getItem("userId");
  const [addFriend] = useMutation(queries.user.ADD_FRIEND);
  const [removeFriend] = useMutation(queries.user.REMOVE_FRIEND);

  async function handleAddFriend(friendId, e, fname) {
    e.preventDefault();
    try {
      const { data } = await addFriend({
        variables: {
          friendId: friendId,
        },
      });
      Swal.fire({
        title: "Friend Added!",
        text: `${fname} has been added to your friend list!`,
        icon: "success",
        confirmButtonText: "Awesome!",
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function handleRemoveFriend(friendId, e, fname) {
    e.preventDefault();
    Swal.fire({
      title: "Confirm Unfriending",
      text: `Are you sure you want to remove ${fname} from your friend list?`,
      icon: "info",
      showDenyButton: true,
      denyButtonText: `Oops! No!`,
      confirmButtonText: "Yes, I'm sure!",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        removeFriend({
          variables: {
            friendId: friendId,
          },
        });
        Swal.fire(`${fname} was removed from your friend list`, "", "success");
      } else if (result.isDenied) {
        Swal.fire(`${fname} was not removed from your friend list`, "", "info");
      }
    });
  }

  if (data && cData) {
    let users = data.getUsersForChannel;
    let Channel = cData.getChannelById;
    return (
      <ChannelMembersContainer>
        <Header>
          <HeaderLeft>
            <StarBorderIcon style={styles.largeIcon} />
            <h4>
              <strong>{cData && Channel.displayName}</strong>
            </h4>
          </HeaderLeft>
          <HeaderRight>
          <Button
            onClick={() => {
              navigate("/main");
              setBody("channel");
            }}
          >
            <CloseOutlinedIcon style={styles.largerIcon}/>
          </Button>
          </HeaderRight>
        </Header>
        <MembersContainer>
          
          <Grid
            container
            spacing={3}
            style={{ marginTop: "0px", padding: "1% 5%" }}
          >
            {users.map((user) => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
                  <Card
                    style={{
                      borderRadius: "7px",
                      height: "57vh",
                      cursor: "pointer",
                    }}
                  >
                    <CardMedia
                      component="img"
                      style={{ height: "30vh" }}
                      image={user.profilePicture}
                      alt={user.name}
                      onClick={() => {
                        navigate(`/user/${user._id}`, {
                          state: {
                            prevLocation: window.location.pathname,
                            prevElement: props.currentBody,
                            currChan: location.state.currChan,
                          },
                        });
                        setBody("user");
                      }}
                    />
                    <CardContent
                      onClick={() => {
                        navigate(`/user/${user._id}`, {
                          state: {
                            prevLocation: window.location.pathname,
                            prevElement: props.currentBody,
                            currChan: location.state.currChan,
                          },
                        });
                        setBody("user");
                      }}
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
                      {userId != user._id && !user.friends.includes(userId) && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={(e) => {
                            handleAddFriend(user._id, e, user.name);
                          }}
                        >
                          + Add friend
                        </Button>
                      )}
                      {userId != user._id && user.friends.includes(userId) && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={(e) => {
                            handleRemoveFriend(user._id, e, user.name);
                          }}
                        >
                          - Unfriend
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </MembersContainer>
      </ChannelMembersContainer>
    );
  } else if (loading || cLoading) {
    return (
      <div>
        <CircularProgress color="success" />
        Loading...
      </div>
    );
  } else if (error || cError) {
    console.log(error);
    console.log(cError);
    return <p>Error</p>;
  }
};

export default ChannelDeets;

const ChannelMembersContainer = styled.div`
  flex: 0.6;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 49px;
  float: left;
`;

const MembersContainer = styled.div`
  margin-top: 80px;
  margin-bottom: 2%;
`;

const HeaderLeft = styled.div`
  position: fixed;
  display: flex;

  > h4 {
    /* display: flex; */
    /* margin-left: 10px; */
  }
`;
const HeaderRight = styled.div`
  display: flex;
  position: fixed;

 margin-top: -15px;
  right: 40px;
  > p {
    display: flex;
    align-items: center;
    font-size: 20px;
  }
  @media (max-width: 991px) {
    right: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  justify-content: space-between;
  padding: 50px;
  border-bottom: 1px solid lightgray;
  background-color: white;

  @media (max-width: 991px) {
    padding-left: 10px;
  }
`;
