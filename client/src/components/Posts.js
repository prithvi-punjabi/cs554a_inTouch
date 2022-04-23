import React from "react";
import queries from "../queries";
import { useQuery } from "@apollo/client";

const Posts = () => {
  const { loading, error, data } = useQuery(queries.post.GET_ALL);

  if (data) {
    let posts = data.getAll;
    console.log(posts);
    return (
      <div>
        {posts.map((post) => {
          return (
            <div class="container mt-5 mb-5">
              <div class="row d-flex align-items-center justify-content-center">
                <div class="col-md-6">
                  <div class="card">
                    <div class="d-flex justify-content-between p-2 px-3">
                      <div class="d-flex flex-row align-items-center">
                        {" "}
                        <img
                          src={post.user.profilePicture}
                          width="50"
                          class="rounded-circle"
                        />
                        <div class="d-flex flex-column ml-2">
                          {" "}
                          <span class="font-weight-bold">
                            {post.user.userName}
                          </span>{" "}
                          <small class="text-primary">{post.category}</small>{" "}
                        </div>
                      </div>
                      <div class="d-flex flex-row mt-1 ellipsis">
                        {" "}
                        <small class="mr-2">20 mins</small>{" "}
                        <i class="fa fa-ellipsis-h"></i>{" "}
                      </div>
                    </div>{" "}
                    {post.image && (
                      <img src={post.image} class="img-fluid"></img>
                    )}
                    <div class="p-2">
                      <p class="text-justify">{post.text}</p>
                      <hr />
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex flex-row icons d-flex align-items-center">
                          {" "}
                          <i class="fa fa-heart"></i>{" "}
                        </div>
                        <div class="d-flex flex-row muted-color">
                          {" "}
                          <span>{`${post.comments.length}`} comments</span>{" "}
                        </div>
                      </div>
                      <hr />
                      <div class="comments">
                        {post.comments && (
                          <div class="d-flex flex-row mb-2">
                            <img
                              src="https://i.imgur.com/9AZ2QX1.jpg"
                              width="40"
                              class="rounded-image"
                            />
                            <div class="d-flex flex-column ml-2">
                              {" "}
                              <span class="name">Daniel Frozer</span>{" "}
                              <small class="comment-text">
                                I like this alot! thanks alot
                              </small>
                              <div class="d-flex flex-row align-items-center status">
                                {" "}
                              </div>
                            </div>
                          </div>
                        )}
                        <div class="comment-input">
                          {" "}
                          <input type="text" class="form-control" />
                          <div class="fonts">
                            {" "}
                            <i class="fa fa-camera"></i>{" "}
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
    return <div>Loading...</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
};

export default Posts;
