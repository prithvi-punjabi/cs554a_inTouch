import React from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";
import Swal from "sweetalert2";

const DeleteComment = (props) => {
  const [deleteComment] = useMutation(queries.post.DELETE_COMMENT);

  async function delComm() {
    Swal.fire({
      title: "Confirm Deletion",
      text: `Are you sure you want to delete your comment?`,
      icon: "info",
      showDenyButton: true,
      denyButtonText: `Oops! No!`,
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        deleteComment({
          variables: { commentId: props.commId },
        });
        Swal.fire("Comment Deleted!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Your comment was not deleted", "", "info");
      }
    });
  }
  return (
    <div style={{ alignSelf: "right", padding: "15px 25px" }}>
      <i
        className="fa fa-trash fa-lg rightTrash"
        aria-hidden="true"
        aria-label="delete comment"
        style={{ cursor: "pointer", paddingLeft: "100%", textAlign: "right" }}
        onClick={delComm}
      ></i>
    </div>
  );
};

export default DeleteComment;
