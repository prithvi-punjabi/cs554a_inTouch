import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";

const AddComment = (props) => {
  const [addComment] = useMutation(queries.post.ADD_COMMENT);
  const [comment, setComment] = useState("");

  return (
    <div className="comment-input">
      {" "}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("HELLO");
          addComment({
            variables: { postId: props.postId, comment: comment },
          });
          setComment("");
        }}
      >
        <input
          type="text"
          className="form-control"
          aria-label="Add Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="fonts">
          {" "}
          <button className="fa fa-paper-plane" type="submit"></button>{" "}
        </div>
      </form>
    </div>
  );
};

export default AddComment;
