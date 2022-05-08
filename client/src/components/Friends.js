import React from "react";
import queries from "../queries";
import { useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
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

const Friends = (props) => {
  const { loading, error, data } = useQuery(queries.user.GET_FRIENDS);
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
    let friends = data.getFriends;
    return (
      <Grid
        container
        spacing={3}
        style={{ marginTop: "0px", padding: "1% 5%" }}
      >
        {friends.map((user) => {
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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        handleRemoveFriend(user._id, e);
                      }}
                    >
                      - Unfriend
                    </Button>
                  </CardActions>
                </Link>
              </Card>
            </Grid>
          );
        })}
      </Grid>
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
