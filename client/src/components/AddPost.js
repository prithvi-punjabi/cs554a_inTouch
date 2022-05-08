import React, { useState, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import queries from "../queries";
import { useNavigate } from "react-router";
import { uploadFile, predictor } from "../helper";
import Swal from "sweetalert2";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ConnectWithoutContactOutlinedIcon from "@mui/icons-material/ConnectWithoutContactOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
const AddPost = (props) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  let tBox = useRef({ current: { value: "" } });
  const model = useRef();
  const [addPost] = useMutation(queries.post.ADD, {
    update(cache, { data: addPost }) {
      let post = cache.readQuery({
        query: queries.post.GET,
      });

      if (!post) {
        post = [];
        post.getPostsForUser = [];
      }
      cache.writeQuery({
        query: queries.post.GET,
        data: {
          getPostsForUser: [...[addPost.createPost], ...post.getPostsForUser],
        },
      });
    },
  });

  const setBody = (type) => {
    props.currentBody(type);
  };

  async function createPost(e) {
    e.preventDefault();
    if (!category) {
      Swal.fire({
        title: "Error!",
        text: "Please choose a category for your post!",
        icon: "error",
        confirmButtonText: "I'll fix it!",
      });
      return;
    }
    const predictions = await predictor(tBox.current.value, model);
    if (predictions) {
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
            variables: {
              text: tBox.current.value,
              image: imagePath,
              category: category,
            },
          });
        } else {
          await addPost({
            variables: {
              text: tBox.current.value,
              image: "",
              category: category,
            },
          }).catch((e) => {
            Swal.fire({
              title: "Error!",
              text: e.message,
              icon: "error",
              confirmButtonText: "I'll fix it!",
            });
          });
        }
        tBox.current.value = "";
        setCategory("");
        setImage("");
      }
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
                ref={tBox}
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
                  <div class="middle">
                    <label>
                      <input
                        type="radio"
                        value="academic"
                        name="category"
                        checked={category === "academic"}
                        onClick={(e) => setCategory(e.target.value)}
                      />
                      <div class="academic box">
                        <span>
                          <SchoolOutlinedIcon />
                        </span>
                        <br />
                        <span>Academic</span>
                      </div>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="housing"
                        name="category"
                        checked={category === "housing"}
                        onClick={(e) => setCategory(e.target.value)}
                      />
                      <div class="housing box">
                        <span>
                          <HomeOutlinedIcon />
                        </span>
                        <br />
                        <span>Housing</span>
                      </div>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="social"
                        name="category"
                        checked={category === "social"}
                        onClick={(e) => setCategory(e.target.value)}
                      />
                      <div class="social box">
                        <span>
                          <ConnectWithoutContactOutlinedIcon />
                        </span>
                        <br />
                        <span>Social</span>
                      </div>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="career"
                        name="category"
                        checked={category === "career"}
                        onClick={(e) => setCategory(e.target.value)}
                      />
                      <div class="career box">
                        <span>
                          <WorkOutlineOutlinedIcon />
                        </span>
                        <br />
                        <span>Career</span>
                      </div>
                    </label>
                  </div>
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
