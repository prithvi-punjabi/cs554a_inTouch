import React, { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";
import useTextToxicity from "react-text-toxicity";
import Swal from "sweetalert2";
import { predictor } from "../helper";
import useSound from "use-sound";
import duckSfx from "../sound/duck.mp3";

const AddComment = (props) => {
  const [addComment] = useMutation(queries.post.ADD_COMMENT);
  const [text, setText] = useState("");
  const textBox = useRef(null);
  const model = useRef();
  const [playDuck] = useSound(duckSfx);
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
            if (!textBox.current.value || textBox.current.value.trim() == "") {
              playDuck();
              Swal.fire({
                icon: "error",
                title: "Comment cannot be empty",
              }).then(() => {
                textBox.current.value = "";
              });
              return;
            }
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
        <input
          type="text"
          className="form-control"
          aria-label="Add Comment"
          ref={textBox}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="fonts">
          {" "}
          <button
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
