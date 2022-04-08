import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  let navigate = useNavigate();
  let email;
  let password;

  const postData = async (e) => {
    e.preventDefault();
    const thisUser = await axios.post("http://localhost:4000/user/login", {
      email: email.value,
      password: password.value,
    });
    email.value = "";
    password.value = "";
    alert("Successful login!");
    navigate("/feed", { state: thisUser.data });
  };

  return (
    <div>
      <form onSubmit={postData}>
        <label>
          Enter your email
          <br />
          <input ref={(node) => (email = node)}></input>
        </label>
        <br />
        <label>
          Enter your password
          <br />
          <input type="password" ref={(node) => (password = node)}></input>
        </label>
        <br />
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
