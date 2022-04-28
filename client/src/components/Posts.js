import React from "react";
import queries from "../queries";
import { useQuery } from "@apollo/client";
import LikePost from "./LikePost";
import AddComment from "./AddComment";
import "../App.css";
const Posts = () => {
  const { loading, error, data } = useQuery(queries.post.GET_ALL, {
    fetchPolicy: "cache-and-network",
  });
  const userId = localStorage.getItem("userId");
  if (data) {
    let posts = data.getAll;
    console.log(posts);

    return (
      <div className="displayContainer">
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
                        />
                        <div className="d-flex flex-column ml-2">
                          {" "}
                          <span className="font-weight-bold">
                            {post.user.userName}
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
                        <i className="fa fa-ellipsis-h"></i>{" "}
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
                            console.log(comment.user);
                            return (
                              <div className="d-flex flex-row mb-2">
                                <img
                                  src={comment.user.profilePicture}
                                  width="40"
                                  className="rounded-image"
                                  alt={comment.user.userName}
                                />
                                <div className="d-flex flex-column ml-2">
                                  {" "}
                                  <span className="name">
                                    {comment.user.userName}
                                  </span>{" "}
                                  <small className="comment-text">
                                    {comment.comment}
                                  </small>
                                  <div className="d-flex flex-row align-items-center status">
                                    {" "}
                                  </div>
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
    );
  } else if (loading) {
    return <div className="displayContainer">Loading...</div>;
  } else if (error) {
    return <div className="displayContainer">{error.message}</div>;
  }
};

export default Posts;
