import React, { useEffect, useState } from "react";
import queries from "../queries";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import LikePost from "./LikePost";
import AddComment from "./AddComment";
import DeleteComment from "./DeleteComment";
import { Link, useNavigate } from "react-router-dom";
import DropdownButton from "react-bootstrap/DropdownButton";
import AddPost from "./AddPost";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import { CircularProgress } from "@mui/material";

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
const newlyAdded = [];
const Posts = (props) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState();
  const { loading, error, data } = useQuery(queries.post.GET, {
    fetchPolicy: "cache-and-network",
  });
  const [getFriendRecommendations] = useLazyQuery(
    queries.user.GET_FRIEND_RECOMMENDATIONS
  );
  const [addFriend] = useMutation(queries.user.ADD_FRIEND);
  const [removeFriend] = useMutation(queries.user.REMOVE_FRIEND);

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
          navigate("/main");
          // window.location.reload();
          setBody("feed");
        });
      }
      setRecommendations(newRecommendations);
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
      newlyAdded.splice(newlyAdded.indexOf(friendId), 1);
      const newRecommendations = recommendations.map((user) => {
        if (user._id.toString() == friendId) {
          return data.deleteFriend;
        }
        return user;
      });
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
    if (error && error.message === "No posts found") fetchRecommendations();
  }, [error]);

  const userId = localStorage.getItem("userId");
  if (data) {
    let posts = data.getPostsForUser;

    return (
      <PostDiv>
        <div className="displayContainer">
          <AddPost
            user={props.user}
            setCurrentBody={props.setCurrentBody}
            currentBody={props.currentBody}
          />
          {posts.map((post) => {
            let days = Math.floor(
              (new Date() - new Date(post.dateCreated)) / (1000 * 3600 * 24)
            );
            return (
              <div className="container mt-5 mb-5" key={post._id}>
                <div className="row d-flex align-items-center justify-content-center">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="d-flex justify-content-between p-2 px-3">
                        <div className="d-flex flex-row align-items-center">
                          {" "}
                          <img
                            src={post.user.profilePicture}
                            width="50"
                            className="rounded-circle"
                            alt={post.user.userName}
                            onClick={() => {
                              setBody("user");
                              {
                                userId === post.user._id &&
                                  navigate("/profile", {
                                    state: {
                                      prevLocation: window.location.pathname,
                                      prevElement: props.currentBody,
                                    },
                                  });
                              }
                              {
                                userId !== post.user._id &&
                                  navigate(`/user/${post.user._id}`, {
                                    state: {
                                      prevLocation: window.location.pathname,
                                      prevElement: props.currentBody,
                                    },
                                  });
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          />
                          <div className="d-flex flex-column ml-2">
                            {" "}
                            <span
                              className="font-weight-bold"
                              onClick={() => {
                                setBody("user");
                                {
                                  userId === post.user._id &&
                                    navigate("/profile", {
                                      state: {
                                        prevLocation: window.location.pathname,
                                        prevElement: props.currentBody,
                                      },
                                    });
                                }
                                {
                                  userId !== post.user._id &&
                                    navigate(`/user/${post.user._id}`, {
                                      state: {
                                        prevLocation: window.location.pathname,
                                        prevElement: props.currentBody,
                                      },
                                    });
                                }
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              {post.user.name}
                            </span>{" "}
                            <small className="text-primary catText">
                              {post.category}
                            </small>{" "}
                          </div>
                        </div>
                        <div className="d-flex flex-row mt-1 ellipsis">
                          {" "}
                          {days === 0 && <small className="mr-2">Today</small>}
                          {days === 1 && (
                            <small className="mr-2">1 day ago</small>
                          )}
                          {days > 1 && (
                            <small className="mr-2">{days} days ago</small>
                          )}
                          {userId === post.user._id && (
                            <div>
                              <DropdownButton
                                id="dropdown-basic-button"
                                variant="default"
                                size="sm"
                                title={
                                  <span>
                                    <i className="fa fa-ellipsis-h"></i>
                                  </span>
                                }
                              >
                                <EditPost post={post} />
                                <DeletePost postId={post._id} />
                              </DropdownButton>
                            </div>
                          )}
                        </div>
                      </div>{" "}
                      {post.image && (
                        <img
                          src={post.image}
                          className="img-fluid"
                          alt={post.text}
                        ></img>
                      )}
                      <div className="p-2">
                        <p className="text-justify">{post.text}</p>
                        <hr />
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex flex-row icons d-flex align-items-center">
                            {" "}
                            <LikePost likes={post.likes} postId={post._id} />
                            <small className="likeCount muted-color">
                              {post.likes.length}
                            </small>
                          </div>
                          <div className="d-flex flex-row muted-color">
                            {" "}
                            {post.comments.length !== 1 && (
                              <span>{`${post.comments.length}`} comments</span>
                            )}
                            {post.comments.length === 1 && (
                              <span>1 comment</span>
                            )}
                          </div>
                        </div>
                        <hr />
                        <div className="comments">
                          {post.comments.length > 0 &&
                            post.comments.map((comment) => {
                              return (
                                <div
                                  className="d-flex flex-row mb-2"
                                  key={comment._id}
                                  style={{ width: "100%" }}
                                >
                                  <img
                                    src={comment.user.profilePicture}
                                    width="40"
                                    className="rounded-image"
                                    alt={comment.user.userName}
                                    onClick={() => {
                                      setBody("user");
                                      navigate(`/user/${post.user._id}`, {
                                        state: {
                                          prevLocation:
                                            window.location.pathname,
                                          prevElement: props.currentBody,
                                        },
                                      });
                                    }}
                                    style={{ cursor: "pointer" }}
                                  />
                                  <div className="d-flex flex-column ml-2">
                                    {" "}
                                    <span
                                      className="name"
                                      onClick={() => {
                                        setBody("user");
                                        navigate(`/user/${comment.user._id}`, {
                                          state: {
                                            prevLocation:
                                              window.location.pathname,
                                            prevElement: props.currentBody,
                                          },
                                        });
                                      }}
                                      style={{
                                        cursor: "pointer",
                                        textAlign: "left",
                                      }}
                                    >
                                      {comment.user.name}
                                    </span>{" "}
                                    <small className="comment-text">
                                      {comment.comment}
                                    </small>
                                    <div className="d-flex flex-row align-items-center status">
                                      {" "}
                                    </div>
                                  </div>
                                  <div style={{ flex: "1" }}>
                                    {userId === comment.user._id && (
                                      <DeleteComment commId={comment._id} />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          <AddComment postId={post._id} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PostDiv>
    );
  } else if (loading) {
    return (
      <PostDiv>
        <div className="displayContainer">
          <CircularProgress color="success" />
          Loading...
        </div>{" "}
      </PostDiv>
    );
  } else if (error) {
    if (error.message === "No posts found") {
      if (recommendations) {
        return (
          <PostDiv style={{ marginTop: "5%", padding: "0% 2%" }}>
            <AddPost user={props.user} currentBody={props.currentBody} />
            <Typography
              variant="h5"
              component="h3"
              style={{ color: "#dc3545", fontWeight: "bold" }}
            >
              OR
            </Typography>
            <Typography
              variant="h5"
              component="h3"
              style={{ color: "#dc3545", fontWeight: "bold" }}
            >
              Start making new friends to enjoy feed
            </Typography>
            <Grid
              container
              spacing={3}
              style={{ marginTop: "0px", padding: "1% 5%" }}
            >
              {recommendations.map((user) => {
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
          </PostDiv>
        );
      } else {
        return (
          <PostDiv>
            <div className="displayContainer">
              Fetching recommendations... <CircularProgress color="success" />
            </div>
          </PostDiv>
        );
      }
    } else {
      return (
        <PostDiv>
          <div className="displayContainer">{typeof error.message}</div>{" "}
        </PostDiv>
      );
    }
  }
};

export default Posts;

const PostDiv = styled.div`
  flex: 0.6;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 4%;
  float: left;
`;
