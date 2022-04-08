import React from "react";
// import Nav from "./Nav";

const Signup = () => {
  return (
    <div>
      <form>
        <label>
          Enter your access token
          <br />
          <input id="accessKey" name="accessKey"></input>
        </label>
        <br />
        <label>
          Enter your Username
          <br />
          <input id="userName" name="userName"></input>
        </label>
        <br />
        <label>
          Enter your password
          <br />
          <input type="password" id="password" name="password"></input>
        </label>
        <br />
        <label>
          Enter your pronouns
          <br />
          <input id="pronouns" name="pronouns"></input>
        </label>
        <br />
        <label>
          Enter your Gender
          <br />
          <input id="gender" name="gender"></input>
        </label>
        <br />
        <label>
          Enter your Contact number
          <br />
          <input id="contactNo" name="contactNo"></input>
        </label>
        <br />
        <label>
          Enter your date of Birth
          <br />
          <input type="date" id="dob" name="dob"></input>
        </label>
        <br />
        <br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
