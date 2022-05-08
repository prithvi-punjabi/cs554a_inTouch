import { useQuery, useMutation } from "@apollo/client";
import React from "react";
import queries from "../queries";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import "../App.css";
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

const ChannelDeets = () => {
  const params = useParams();
  console.log(params);
  const { loading, error, data } = useQuery(queries.channel.GET_USERS, {
    variables: { getUsersForChannelId: params.id },
  });
  const userId = localStorage.getItem("userId");
  const [addFriend] = useMutation(queries.user.ADD_FRIEND);
  const [removeFriend] = useMutation(queries.user.REMOVE_FRIEND);

  async function handleAddFriend(friendId, e) {
    e.preventDefault();
    try {
      const { data } = await addFriend({
        variables: {
          friendId: friendId,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function handleRemoveFriend(friendId, e) {
    e.preventDefault();
    try {
      const { data } = await removeFriend({
        variables: {
          friendId: friendId,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  if (data) {
    let users = data.getUsersForChannel;
    return (
      <div>
        <h1>Channel Members</h1>
        <Grid
          container
          spacing={3}
          style={{ marginTop: "0px", padding: "1% 5%" }}
        >
          {users.map((user) => {
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
                      {userId != user._id && !user.friends.includes(userId) && (
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
      </div>
    );
  } else if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    console.log(error);
    return <p>Error</p>;
  }
};

export default ChannelDeets;
