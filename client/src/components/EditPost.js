import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import queries from "../queries";
import { useMutation } from "@apollo/client";
import useTextToxicity from "react-text-toxicity";
import Swal from "sweetalert2";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ConnectWithoutContactOutlinedIcon from "@mui/icons-material/ConnectWithoutContactOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";

const EditPost = (props) => {
  const [show, setShow] = useState(false);
  const [text, setText] = useState(props.post.text);
  const [category, setCategory] = useState(props.post.category);
  const [updatePost] = useMutation(queries.post.UPDATE);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const predictions = useTextToxicity(text);

  async function editPost(e) {
    e.preventDefault();
    if (text === "") setText(props.post.text);
    if (category === "") setCategory(props.post.category);
    let isToxic = false;
    if (predictions) {
      predictions.forEach((x) => {
        if (x.match === true) {
          isToxic = true;
          if (x.label === "toxicity") x.label = "toxic";
          Swal.fire({
            title: "Toxic Text Detected!",
            text: `Your post has been labelled ${x.label} with a probability of ${x.probability}. You cannot post it.`,
            icon: "error",
            confirmButtonText: "I'm sorry!",
          });
        }
      });
    }
    if (!text || text.trim() == "") {
      Swal.fire({
        title: "Error!",
        text: "Please add a description for the post!",
        icon: "error",
        confirmButtonText: "I'll fix it!",
      });
      return;
    }
    if (!category || category.trim() == "") {
      Swal.fire({
        title: "Error!",
        text: "Please choose a category for the post!",
        icon: "error",
        confirmButtonText: "I'll fix it!",
      });
      return;
    }
    if (isToxic === false) {
      let data = await updatePost({
        variables: { postId: props.post._id, text: text, category: category },
      }).catch((e) => {
        Swal.fire({
          title: "Error!",
          text: `${props.post.user.name}, ` + e.message,
          icon: "error",
          confirmButtonText: "I'll fix it!",
        });
      });

      if (data) {
        handleClose();
        Swal.fire({
          title: "Post Updated!",
          text: `${props.post.user.name}, your post has been updated!`,
          icon: "success",
          confirmButtonText: "Yay!",
        });
      }
    }
  }

  return (
    <div>
      <Dropdown.Item onClick={handleShow}>Edit</Dropdown.Item>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container mt-5 mb-5">
            <div className="row d-flex align-items-center justify-content-center">
              <div className="col-md-9">
                <div className="card">
                  <div className="d-flex justify-content-between p-2 px-3">
                    <div className="d-flex flex-row align-items-center">
                      {" "}
                      <img
                        src={props.post.user.profilePicture}
                        width="50"
                        className="rounded-circle"
                        alt={props.post.user.userName}
                        style={{ cursor: "pointer" }}
                      />
                      <div className="d-flex flex-column ml-2">
                        {" "}
                        <span
                          style={{ cursor: "pointer" }}
                          className="font-weight-bold"
                        >
                          {props.post.user.name}
                        </span>{" "}
                      </div>
                    </div>
                  </div>
                  <form className="postForm" id="upForm" onSubmit={editPost}>
                    <label for="addpost" hidden>
                      Add post Textarea
                    </label>
                    <textarea
                      id="addpost"
                      value={text}
                      placeholder="Tell us what you're thinking..."
                      onChange={(e) => setText(e.target.value)}
                    />
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
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="btn-lg btn-danger" type="submit" form="upForm">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditPost;
