import React from "react";
import queries from "../queries";
import { useQuery } from "@apollo/client";
import LikePost from "./LikePost";
import "../App.css";
const Posts = () => {
  const { loading, error, data } = useQuery(queries.post.GET_ALL, {
    fetchPolicy: "cache-and-network",
  });
  if (data) {
    let posts = data.getAll;

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
                        <small className="mr-2">20 mins</small>{" "}
                        <i className="fa fa-ellipsis-h"></i>{" "}
                      </div>
                    </div>{" "}
                    {post.image && (
                      <img src={post.image} className="img-fluid"></img>
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
                          <span>{`${post.comments.length}`} comments</span>{" "}
                        </div>
                      </div>
                      <hr />
                      <div className="comments">
                        {post.comments && (
                          <div className="d-flex flex-row mb-2">
                            <img
                              src="https://i.imgur.com/9AZ2QX1.jpg"
                              width="40"
                              className="rounded-image"
                            />
                            <div className="d-flex flex-column ml-2">
                              {" "}
                              <span className="name">Daniel Frozer</span>{" "}
                              <small className="comment-text">
                                I like this alot! thanks alot
                              </small>
                              <div className="d-flex flex-row align-items-center status">
                                {" "}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="comment-input">
                          {" "}
                          <input type="text" className="form-control" />
                          <div className="fonts">
                            {" "}
                            <i className="fa fa-camera"></i>{" "}
                          </div>
                        </div>
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
