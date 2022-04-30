import React from "react";
import queries from "../queries";
import { useQuery } from "@apollo/client";
import LikePost from "./LikePost";
import AddComment from "./AddComment";
import DeleteComment from "./DeleteComment";
import { useNavigate } from "react-router-dom";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import AddPost from "./AddPost";
import DeletePost from "./DeletePost";

import "../App.css";
const Posts = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(queries.post.GET_ALL, {
    fetchPolicy: "cache-and-network",
  });

  const userId = localStorage.getItem("userId");
  if (data) {
    let posts = data.getAll;

    return (
      <div className="displayContainer">
        <AddPost userId={userId} />
        {posts.map((post) => {
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
                          onClick={() => navigate(`/user/${post.user._id}`)}
                          style={{ cursor: "pointer" }}
                        />
                        <div className="d-flex flex-column ml-2">
                          {" "}
                          <span
                            className="font-weight-bold"
                            onClick={() => navigate(`/user/${post.user._id}`)}
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
                        <small className="mr-2">
                          {Math.floor(
                            (new Date() - new Date(post.dateCreated)) /
                              (1000 * 3600 * 24)
                          )}{" "}
                          days ago
                        </small>{" "}
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
                              <Dropdown.Item>Update</Dropdown.Item>
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
                          {post.comments.length === 1 && <span>1 comment</span>}
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
                              >
                                <img
                                  src={comment.user.profilePicture}
                                  width="40"
                                  className="rounded-image"
                                  alt={comment.user.userName}
                                  onClick={() =>
                                    navigate(`/user/${post.user._id}`)
                                  }
                                  style={{ cursor: "pointer" }}
                                />
                                <div className="d-flex flex-column ml-2">
                                  {" "}
                                  <span
                                    className="name"
                                    onClick={() =>
                                      navigate(`/user/${comment.user._id}`)
                                    }
                                    style={{ cursor: "pointer" }}
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
                                {userId === comment.user._id && (
                                  <DeleteComment commId={comment._id} />
                                )}
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
    );
  } else if (loading) {
    return <div className="displayContainer">Loading...</div>;
  } else if (error) {
    return <div className="displayContainer">{error.message}</div>;
  }
};

export default Posts;
