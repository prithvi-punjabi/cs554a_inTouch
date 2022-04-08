import React from "react";
import axios from "axios";

const Signup = () => {
  let accessKey;
  let userName;
  let password;
  let gender;
  let contactNo;
  let dob;
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          axios.post("http://localhost:4000/user/create", {
            accessKey: accessKey.value,
            userName: userName.value,
            password: password.value,
            gender: gender.value,
            contactNo: contactNo.value,
            dob: dob.value,
          });
          accessKey.value = "";
          userName.value = "";
          password.value = "";
          gender.value = "";
          contactNo.value = "";
          dob.value = "";
          alert("User added!");
        }}
      >
        <label>
          Enter your access token
          <br />
          <input ref={(node) => (accessKey = node)}></input>
        </label>
        <br />
        <label>
          Enter your Username
          <br />
          <input ref={(node) => (userName = node)}></input>
        </label>
        <br />
        <label>
          Enter your password
          <br />
          <input type="password" ref={(node) => (password = node)}></input>
        </label>
        <br />
        <label>
          Enter your Gender
          <br />
          <input ref={(node) => (gender = node)}></input>
        </label>
        <br />
        <label>
          Enter your Contact number
          <br />
          <input ref={(node) => (contactNo = node)}></input>
        </label>
        <br />
        <label>
          Enter your date of Birth
          <br />
          <input type="date" ref={(node) => (dob = node)}></input>
        </label>
        <br />
        <br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
