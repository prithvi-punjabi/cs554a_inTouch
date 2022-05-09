import React from "react";
import queries from "../queries";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
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

const Friends = (props) => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(queries.user.GET_FRIENDS, {
    fetchPolicy: "cache-and-network",
  });
  const [removeFriend] = useMutation(queries.user.REMOVE_FRIEND, {
    update(cache, { data: removeFriend }) {
      const friends = cache.readQuery({
        query: queries.user.GET_FRIENDS,
      });
      console.log(removeFriend);
      cache.writeQuery({
        query: queries.user.GET_FRIENDS,
        data: {
          getFriends: friends.getFriends.filter(
            (e) => e._id !== removeFriend.deleteFriend._id
          ),
        },
      });
    },
  });

  const setBody = (type) => {
    props.setCurrentBody(type);
  };
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
            <h4>Friends</h4>
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
