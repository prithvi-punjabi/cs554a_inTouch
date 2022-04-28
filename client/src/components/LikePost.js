import React from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";

const LikePost = (props) => {
  const [likePost] = useMutation(queries.post.LIKE);
  const userId = localStorage.getItem("userId");

  async function likeThis() {
    await likePost({ variables: { postId: props.postId } });
  }

  return (
    <div>
      {props.likes.includes(userId) && (
        <i
          className="fa fa-heart"
          onClick={likeThis}
          style={{ cursor: "pointer" }}
        ></i>
      )}
      {props.likes.includes(userId) !== true && (
        <i
          className="fa fa-heart-o"
          onClick={likeThis}
          style={{ cursor: "pointer" }}
        ></i>
      )}
    </div>
  );
};

export default LikePost;
