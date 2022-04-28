import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";
import useTextToxicity from "react-text-toxicity";
import Swal from "sweetalert2";

const AddComment = (props) => {
  const [addComment] = useMutation(queries.post.ADD_COMMENT);
  const [comment, setComment] = useState("");
  const predictions = useTextToxicity(comment);

  return (
    <div className="comment-input">
      {" "}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          let isToxic = false;
          predictions.forEach((x) => {
            if (x.match === true) {
              isToxic = true;
              if ((x.label = "toxicity")) x.label = "toxic";
              Swal.fire({
                title: "Toxic Text Detected!",
                text: `Your comment has been labelled ${x.label} with a probability of ${x.probability}. You cannot post it.`,
                icon: "error",
                confirmButtonText: "I'm sorry!",
              });
            }
          });
          if (!isToxic) {
            const com = await addComment({
              variables: { postId: props.postId, comment: comment },
            });
            setComment("");
          }
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
