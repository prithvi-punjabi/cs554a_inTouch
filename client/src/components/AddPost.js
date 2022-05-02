import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import queries from "../queries";
import { useNavigate } from "react-router";
import { uploadFile } from "../helper";
import useTextToxicity from "react-text-toxicity";
import Swal from "sweetalert2";

const AddPost = (props) => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [addPost] = useMutation(queries.post.ADD, {
    update(cache, { data: addPost }) {
      let post = cache.readQuery({
        query: queries.post.GET_ALL,
      });
      cache.writeQuery({
        query: queries.post.GET_ALL,
        data: { getAll: [...[addPost.createPost], ...post.getAll] },
      });
    },
  });

  const predictions = useTextToxicity(text);

  const setBody = (type) => {
    props.currentBody(type);
  };

  async function createPost(e) {
    e.preventDefault();
    let isToxic = false;
    predictions.forEach((x) => {
      if (x.match === true) {
        isToxic = true;
        if ((x.label = "toxicity")) x.label = "toxic";
        Swal.fire({
          title: "Toxic Text Detected!",
          text: `Your post has been labelled ${x.label} with a probability of ${x.probability}. You cannot post it.`,
          icon: "error",
          confirmButtonText: "I'm sorry!",
        });
      }
    });
    if (!isToxic) {
      if (image) {
        const imagePath = await uploadFile(image);
        await addPost({
          variables: { text: text, image: imagePath, category: category },
        });
      } else {
        await addPost({
          variables: { text: text, image: "", category: category },
        });
      }
      setText("");
      setCategory("");
      setImage("");
    }
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row d-flex align-items-center justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="d-flex justify-content-between p-2 px-3">
              <div className="d-flex flex-row align-items-center">
                {" "}
                <img
                  src={props.user.profilePicture}
                  width="50"
                  className="rounded-circle"
                  alt={props.user.userName}
                  onClick={() => {
                    setBody("user");
                    navigate("/profile");
                  }}
                  style={{ cursor: "pointer" }}
                />
                <div className="d-flex flex-column ml-2">
                  {" "}
                  <span
                    className="font-weight-bold"
                    onClick={() => {
                      setBody("user");
                      navigate("/profile");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {props.user.name}
                  </span>{" "}
                </div>
              </div>
            </div>
            <form className="postForm" onSubmit={createPost}>
              <textarea
                placeholder="Tell us what you're thinking..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="image-upload">
                <label htmlFor="file-input">
                  <i
                    className="fa fa-upload fa-lg"
                    aria-hidden="true"
                    style={{ cursor: "pointer" }}
                  ></i>
                </label>
                <input
                  id="file-input"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div>
                <fieldset>
                  <input
                    type="radio"
                    value="academic"
                    name="category"
                    checked={category === "academic"}
                    onClick={(e) => setCategory(e.target.value)}
                  />
                  Academic
                  <span className="cat"> </span>
                  <input
                    type="radio"
                    value="housing"
                    name="category"
                    checked={category === "housing"}
                    onClick={(e) => setCategory(e.target.value)}
                  />
                  Housing
                  <span className="cat"> </span>
                  <input
                    type="radio"
                    value="social"
                    name="category"
                    checked={category === "social"}
                    onClick={(e) => setCategory(e.target.value)}
                  />
                  Social
                  <span className="cat"> </span>
                  <input
                    type="radio"
                    value="career"
                    name="category"
                    checked={category === "career"}
                    onClick={(e) => setCategory(e.target.value)}
                  />
                  Career
                </fieldset>
              </div>
              <div className="postBut">
                <button type="submit">Post</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
