import React from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  let navigate = useNavigate();
  let accessKey;
  let userName;
  let password;
  let gender;
  let contactNo;
  let dob;
  return (
    <div class="main">

        <section class="signup">
            
            <div class="container1">
                <div class="signup-content">
      <form class="signup-form" 
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
          navigate("/login");
        }}
      >
        <h2 class="form-title">Create account</h2>
        <br />
        <div class="form-group "> 
        <label>
          Enter your access token
          <br />
          <input class="form-input" ref={(node) => (accessKey = node)}></input>
        </label>
        </div>
        
        <div class="form-group ">
        <label>
          Enter your Username
          <br />
          <input class="form-input" ref={(node) => (userName = node)}></input>
        </label>
        </div>
        
        <div class="form-group ">
        <label>
          Enter your password
          <br />
          <input class="form-input" type="password" ref={(node) => (password = node)}></input>
        </label>
        </div>

        <div class="form-group ">
        <label>
          Enter your Gender
          <br />
          <input class="form-input" ref={(node) => (gender = node)}></input>
        </label>
        </div>

        <div class="form-group ">
        <label>
          Enter your Contact number
          <br />
          <input class="form-input" ref={(node) => (contactNo = node)}></input>
        </label>
        </div>
        <div class="form-group ">
        <label>
          Enter your date of Birth
          <br />
          <input class="form-input " type="date" ref={(node) => (dob = node)}></input>
        </label>
        </div>
        <br />
       
        <button class="btn-lg btn-danger" type="submit">Sign Up</button>
      </form>
      <p class="loginhere">
        Have already an account ? <Link to={`/login`} class="loginhere-link" variant="contained">Log in</Link>
      </p>
      </div>
            </div>
        </section>
    </div>
  );
};

export default Signup;
