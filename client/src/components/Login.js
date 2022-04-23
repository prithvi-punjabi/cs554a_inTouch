import axios from "axios";
import React from "react";
import { useNavigate,Link } from "react-router-dom";

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
    <div class="main1">
   
    <section class="signup">
        
        <div class="container1">
            <div class="signup-content">
      <form class="signup-form" onSubmit={postData}>
      <h2 class="form-title">Login</h2>

      <div class="form-group">
        <label>
          Enter your email
          <br />
          <input class="form-input" ref={(node) => (email = node)}></input>
        </label>
        </div>
      
        <div class="form-group">
        <label>
          Enter your password
          <br />
          <input class="form-input" type="password" ref={(node) => (password = node)}></input>
        </label>
        </div>
        <br />
       
        <button class="btn-lg btn-danger" type="submit">Log In</button>
      </form>
      <p class="loginhere">
      Don't have an account ?
      <Link to={`/signup`} class="loginhere-link" variant="contained">Sign up</Link>
                         
                    </p>
      </div>
               </div>
   
           </section>
   
       </div>
  );
};

export default Login;
