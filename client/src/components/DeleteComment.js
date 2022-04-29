import React from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";

const DeleteComment = (props) => {
  const [deleteComment] = useMutation(queries.post.DELETE_COMMENT);

  async function delComm() {
    await deleteComment({
      variables: { commentId: props.commId },
    });
  }
  return (
    <div>
      <i
        className="fa fa-trash fa-lg rightTrash"
        aria-hidden="true"
        aria-label="delete comment"
        style={{ cursor: "pointer", paddingLeft: "100%" }}
        onClick={delComm}
      ></i>
    </div>
  );
};

export default DeleteComment;
