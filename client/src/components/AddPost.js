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
  const [text, setText] = useState("");
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
    props.setCurrentBody(type);
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
            text: `Your post contains text that violates our Community Guidelines. You cannot post it.`,
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
                    navigate("/profile", {
                      state: {
                        prevLocation: window.location.pathname,
                        prevElement: props.currentBody,
                      },
                    });
                  }}
                  style={{ cursor: "pointer" }}
                />
                <div className="d-flex flex-column ml-2">
                  {" "}
                  <span
                    className="font-weight-bold"
                    onClick={() => {
                      setBody("user");
                      navigate("/profile", {
                        state: {
                          prevLocation: window.location.pathname,
                          prevElement: props.currentBody,
                        },
                      });
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {props.user.name}
                  </span>{" "}
                </div>
              </div>
            </div>
            <form className="postForm" onSubmit={createPost}>
              <label for="addpost" hidden>
                Add post Textarea
              </label>
              <textarea
                id="addpost"
                placeholder="Tell us what you're thinking..."
                ref={tBox}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="image-upload">
                <div
                  class="card col-md-3"
                  id="div-imgPost"
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "none",
                    gridTemplate: "1fr/1fr",
                    placeItems: "center",
                    cursor: "pointer",
                  }}
                  onMouseOver={() => {
                    document.getElementById("btn-remove-img").style.display =
                      "block";
                  }}
                  onMouseLeave={() => {
                    document.getElementById("btn-remove-img").style.display =
                      "none";
                  }}
                  onClick={() => {
                    document.getElementById("imgPost").src = "#";
                    document.getElementById("div-imgPost").style.display =
                      "none";
                    setImage(null);
                  }}
                >
                  <img
                    id="imgPost"
                    alt="image to be uploaded"
                    style={{
                      width: "100px",
                      height: "100px",
                      gridColumn: "1/1",
                      gridRow: "1/1",
                    }}
                  />
                  <span
                    id="btn-remove-img"
                    class="span-x hide"
                    style={{
                      display: "none",
                      gridColumn: "1/1",
                      gridRow: "1/1",
                      padding: "5px 10px",
                      background: "#00000054",
                    }}
                  >
                    X
                  </span>
                </div>
                <br />
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
                  onChange={(e) => {
                    document.getElementById("imgPost").src =
                      URL.createObjectURL(e.target.files[0]);
                    document.getElementById("div-imgPost").style.display =
                      "grid";
                    setImage(e.target.files[0]);
                  }}
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
                      <span class="academic box">
                        <span>
                          <SchoolOutlinedIcon />
                        </span>
                        <br />
                        <span>Academic</span>
                      </span>
                    </label>

                    <label>
                      <input
                        type="radio"
                        value="housing"
                        name="category"
                        checked={category === "housing"}
                        onClick={(e) => setCategory(e.target.value)}
                      />
                      <span class="housing box">
                        <span>
                          <HomeOutlinedIcon />
                        </span>
                        <br />
                        <span>Housing</span>
                      </span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="social"
                        name="category"
                        checked={category === "social"}
                        onClick={(e) => setCategory(e.target.value)}
                      />
                      <span class="social box">
                        <span>
                          <ConnectWithoutContactOutlinedIcon />
                        </span>
                        <br />
                        <span>Social</span>
                      </span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="career"
                        name="category"
                        checked={category === "career"}
                        onClick={(e) => setCategory(e.target.value)}
                      />
                      <span class="career box">
                        <span>
                          <WorkOutlineOutlinedIcon />
                        </span>
                        <br />
                        <span>Career</span>
                      </span>
                    </label>
                  </div>
                </fieldset>
              </div>
              <div className="postBut">
                <label for="subButton" hidden>
                  Post new post
                </label>
                <button id="subButton" type="submit">
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
