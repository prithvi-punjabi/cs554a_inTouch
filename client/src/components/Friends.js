import React, { useEffect, useState } from "react";
import queries from "../queries";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Link } from "@mui/material";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Button } from "@mui/material";
import styled from "styled-components";
import "../App.css";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Swal from "sweetalert2";
const styles = {
  largeIcon: {
    width: 40,
    height: 32,
  },
  largerIcon: {
    width: 50,
    height: 50,
  },
};
const newlyAdded = [];

const Friends = (props) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState();
  const { loading, error, data } = useQuery(queries.user.GET_FRIENDS, {
    fetchPolicy: "cache-and-network",
  });
  const [addFriend] = useMutation(queries.user.ADD_FRIEND);
  const [removeFriend] = useMutation(queries.user.REMOVE_FRIEND);
  const [getFriendRecommendations] = useLazyQuery(
    queries.user.GET_FRIEND_RECOMMENDATIONS
  );

  const userId = localStorage.getItem("userId");
  const setBody = (type) => {
    props.setCurrentBody(type);
  };

  async function handleAddFriend(friendId, e) {
    e.preventDefault();
    try {
      const { data } = await addFriend({
        variables: {
          friendId: friendId,
        },
      });
      newlyAdded.push(friendId);
      const newRecommendations = recommendations.map((user) => {
        if (user._id.toString() == friendId) {
          return data.addFriend;
        }
        return user;
      });
      if (newlyAdded.length == 4) {
        Swal.fire({
          icon: "success",
          title: "Congratulations",
          text: "You have made some new friends",
          confirmButtonText: "Go to feed",
        }).then(() => {
          //navigate("/main");
          window.location.reload();
          setBody("feed");
        });
      }
      setRecommendations(newRecommendations);
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchRecommendations() {
    try {
      const { data } = await getFriendRecommendations();
      if (
        data &&
        data.getFriendRecommendations &&
        data.getFriendRecommendations.length > 0
      ) {
        setRecommendations(data.getFriendRecommendations);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRecommendations();
  }, []);

  async function handleRemoveFriend(fname, friendId, e) {
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
  if (data) {
    let friends = data.getFriends;
    return (
      <ChannelMembersContainer>
        <Header>
          <HeaderLeft>
            <StarBorderIcon style={styles.largeIcon} />
            <h4>Friends &nbsp; {friends && <span>({friends.length})</span>}</h4>
          </HeaderLeft>
          <HeaderRight></HeaderRight>
        </Header>
        <MembersContainer>
          <Grid
            container
            spacing={3}
            style={{ marginTop: "0px", padding: "1% 5%" }}
          >
            {friends.map((user) => {
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
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          handleRemoveFriend(user.name, user._id, e);
                        }}
                      >
                        - Unfriend
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          <Typography
            variant="h5"
            component="h3"
            style={{
              color: "#dc3545",
              fontWeight: "bold",
              margin: "2% 5%",
            }}
            align="left"
          >
            Recommendations
          </Typography>
          <Grid
            container
            spacing={3}
            style={{ marginTop: "0px", padding: "1% 5%" }}
          >
            {recommendations &&
              recommendations.map((user) => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
                    <Card style={{ borderRadius: "7px", height: "57vh" }}>
                      <Link
                        to={`/user/${user._id}`}
                        style={{ textDecoration: "none", color: "#dc3545" }}
                      >
                        <CardMedia
                          component="img"
                          style={{ height: "30vh" }}
                          image={user.profilePicture}
                          alt={user.name}
                        />
                        <CardContent>
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
                          {userId != user._id &&
                            !user.friends.includes(userId) && (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                  handleAddFriend(user._id, e);
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
                                handleRemoveFriend(user._id, e);
                              }}
                            >
                              - Unfriend
                            </Button>
                          )}
                        </CardActions>
                      </Link>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </MembersContainer>
      </ChannelMembersContainer>
    );
  } else if (loading) {
    return (
      <div>
        <CircularProgress color="success" />
        Loading...
      </div>
    );
  } else if (error) {
    <div>Error</div>;
  }
};

export default Friends;

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
    display: flex;
    /* margin-left: 10px; */
  }
`;
const HeaderRight = styled.div`
  display: flex;
  position: fixed;

  align-items: right;
  /* margin-left: 75%; */
  right: 20px;
  > p {
    display: flex;
    align-items: center;
    font-size: 20px;
  }
  @media (max-width: 991px) {
    display: none;
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
