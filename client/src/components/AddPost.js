import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import queries from "../queries";
import { useNavigate } from "react-router";
import { uploadFile } from "../helper";

const AddPost = (props) => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [addPost] = useMutation(queries.post.ADD, {
    update(cache, { data: { addPost } }) {
      const { posts } = cache.readQuery({
        query: queries.post.GET_ALL,
      });
      console.log(posts);
      cache.writeQuery({
        query: queries.post.GET_ALL,
        data: { posts: posts.concat([addPost]) },
      });
    },
  });
  const { loading, data, error } = useQuery(queries.user.GET_BY_ID, {
    variables: { userId: props.userId },
  });

  async function createPost(e) {
    e.preventDefault();
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

  if (data) {
    return (
      <div className="container mt-5 mb-5">
        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="d-flex justify-content-between p-2 px-3">
                <div className="d-flex flex-row align-items-center">
                  {" "}
                  <img
                    src={data.getUser.profilePicture}
                    width="50"
                    className="rounded-circle"
                    alt={data.getUser.userName}
                    onClick={() => navigate(`/user/${data.getUser._id}`)}
                    style={{ cursor: "pointer" }}
                  />
                  <div className="d-flex flex-column ml-2">
                    {" "}
                    <span
                      className="font-weight-bold"
                      onClick={() => navigate(`/user/${data.getUser._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {data.getUser.name}
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
                      onClick={(e) => setCategory(e.target.value)}
                    />
                    Academic
                    <span className="cat"> </span>
                    <input
                      type="radio"
                      value="housing"
                      name="category"
                      onClick={(e) => setCategory(e.target.value)}
                    />
                    Housing
                    <span className="cat"> </span>
                    <input
                      type="radio"
                      value="social"
                      name="category"
                      onClick={(e) => setCategory(e.target.value)}
                    />
                    Social
                    <span className="cat"> </span>
                    <input
                      type="radio"
                      value="career"
                      name="category"
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
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
};

export default AddPost;
