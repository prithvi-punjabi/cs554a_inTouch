import React from "react";
import queries from "../queries";
import { useQuery } from "@apollo/client";
import LikePost from "./LikePost";
import AddComment from "./AddComment";
import DeleteComment from "./DeleteComment";
import { useNavigate } from "react-router-dom";
import DropdownButton from "react-bootstrap/DropdownButton";
import AddPost from "./AddPost";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";

import styled from "styled-components";

import "../App.css";
const Posts = (props) => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(queries.post.GET_ALL, {
    fetchPolicy: "cache-and-network",
  });

  const setBody = (type) => {
    props.currentBody(type);
  };

  const userId = localStorage.getItem("userId");
  if (data) {
    let posts = data.getAll;

    return (
      <PostDiv>
        <div className="displayContainer">
          <AddPost userId={userId} currentBody={props.currentBody} />
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
                                  navigate("/profile");
                              }
                              {
                                userId !== post.user._id &&
                                  navigate(`/user/${post.user._id}`);
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
                                    navigate("/profile");
                                }
                                {
                                  userId !== post.user._id &&
                                    navigate(`/user/${post.user._id}`);
                                }
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              {post.user.name}
                            </span>{" "}
                            <small className="text-primary">
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
                              {/* <i className="fa fa-ellipsis-h"></i> */}
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
                                      navigate(`/user/${post.user._id}`);
                                    }}
                                    style={{ cursor: "pointer" }}
                                  />
                                  <div className="d-flex flex-column ml-2">
                                    {" "}
                                    <span
                                      className="name"
                                      onClick={() => {
                                        setBody("user");
                                        navigate(`/user/${comment.user._id}`);
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
        <div className="displayContainer">Loading...</div>{" "}
      </PostDiv>
    );
  } else if (error) {
    return (
      <PostDiv>
        <div className="displayContainer">{error.message}</div>{" "}
      </PostDiv>
    );
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
