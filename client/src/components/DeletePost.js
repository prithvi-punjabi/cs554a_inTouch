import React from "react";
import { useMutation } from "@apollo/client";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";
import queries from "../queries";

const DeletePost = (props) => {
  console.log(props.postId);
  const [deletePost] = useMutation(queries.post.REMOVE, {
    update(cache, { data: deletePost }) {
      const post = cache.readQuery({
        query: queries.post.GET,
      });
      cache.writeQuery({
        query: queries.post.GET,
        data: {
          getAll: post.getAll.filter((e) => e._id !== props.postId),
        },
      });
    },
  });
  async function delPost(e) {
    e.preventDefault();
    Swal.fire({
      title: "Confirm Deletion",
      text: `Are you sure you want to delete your post?`,
      icon: "info",
      showDenyButton: true,
      denyButtonText: `Oops! No!`,
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        deletePost({ variables: { postId: props.postId } });
        Swal.fire("Post Deleted!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Your post was not deleted", "", "info");
      }
    });
  }
  return (
    <Dropdown.Item onClick={delPost} style={{ textAlign: "center" }}>
      Delete
    </Dropdown.Item>
  );
};

export default DeletePost;
