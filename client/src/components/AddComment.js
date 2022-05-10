import React, { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";
import useTextToxicity from "react-text-toxicity";
import Swal from "sweetalert2";
import { predictor } from "../helper";

const AddComment = (props) => {
  const [addComment] = useMutation(queries.post.ADD_COMMENT);
  const [text, setText] = useState("");
  const textBox = useRef(null);
  const model = useRef();
  return (
    <div className="comment-input">
      {" "}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const predictions = await predictor(textBox.current.value, model);
          let isToxic = false;
          predictions.forEach((x) => {
            if (x.match === true) {
              isToxic = true;
              if ((x.label = "toxicity")) x.label = "toxic";
              Swal.fire({
                title: "Toxic Text Detected!",
                text: `Your comment contains text that violates our Community Guidelines. You cannot post it.`,
                icon: "error",
                confirmButtonText: "I'm sorry!",
              });
            }
          });
          if (!isToxic) {
            const com = await addComment({
              variables: {
                postId: props.postId,
                comment: textBox.current.value,
              },
            });
            textBox.current.value = "";
          }
        }}
      >
        <label for="newcomment" hidden>
          Add new comment{" "}
        </label>
        <input
          id="newcomment"
          type="text"
          className="form-control"
          aria-label="Add Comment"
          ref={textBox}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="fonts">
          {" "}
          <label for="subButtonComm" hidden>
            Add comment Textarea
          </label>
          <button
            id="subButtonComm"
            className="fa fa-paper-plane"
            type="submit"
            disabled={!text}
          ></button>{" "}
        </div>
      </form>
    </div>
  );
};

export default AddComment;
