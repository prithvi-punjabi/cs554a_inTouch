import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import queries from "../queries";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { isLoggedIn } from "../helper";

const Signup = () => {
  let [signUp] = useMutation(queries.user.CREATE);
  let navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/main", { replace: true });
    }
  }, []);
  let accessKey;
  let userName;
  let password;
  let gender;
  let contactNo;
  let dob;
  return (
    <div className="main">
      <section className="signup">
        <div className="container1">
          <div className="signup-content">
            <form
              className="signup-form"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  if (
                    !accessKey ||
                    !accessKey.value ||
                    accessKey.value.trim() == ""
                  ) {
                    Swal.fire({
                      title: "Error!",
                      text: "Please enter access token to signup!",
                      icon: "error",
                      confirmButtonText: "I'll fix it!",
                    });
                    return;
                  }
                  if (
                    !userName ||
                    !userName.value ||
                    userName.value.trim() == ""
                  ) {
                    Swal.fire({
                      title: "Error!",
                      text: "Please enter username to signup!",
                      icon: "error",
                      confirmButtonText: "I'll fix it!",
                    });
                    return;
                  }
                  if (!password || !password.value || password.value == "") {
                    Swal.fire({
                      title: "Error!",
                      text: "Please enter password to signup!",
                      icon: "error",
                      confirmButtonText: "I'll fix it!",
                    });
                    return;
                  }
                  if (
                    !contactNo ||
                    !contactNo.value ||
                    contactNo.value.trim() == ""
                  ) {
                    Swal.fire({
                      title: "Error!",
                      text: "Please enter contact number to signup!",
                      icon: "error",
                      confirmButtonText: "I'll fix it!",
                    });
                    return;
                  }
                  if (!gender || !gender.value || gender.value == "") {
                    Swal.fire({
                      title: "Error!",
                      text: "Please select gender to signup!",
                      icon: "error",
                      confirmButtonText: "I'll fix it!",
                    });
                    return;
                  }
                  if (!dob || !dob.value || dob.value == "") {
                    Swal.fire({
                      title: "Error!",
                      text: "Please select date of birth to signup!",
                      icon: "error",
                      confirmButtonText: "I'll fix it!",
                    });
                    return;
                  }
                  const thisUser = await signUp({
                    variables: {
                      accessKey: accessKey.value,
                      userName: userName.value,
                      password: password.value,
                      gender: gender.value,
                      contactNo: contactNo.value,
                      dob: dob.value,
                    },
                  });
                  // accessKey.value = "";
                  // userName.value = "";
                  // password.value = "";
                  // gender.value = "";
                  // contactNo.value = "";
                  // dob.value = "";
                  if (thisUser.data.createUser) {
                    Swal.fire({
                      title: "Awesome!",
                      text: `${thisUser.data.createUser.name}, your account has been created on inTouch. Click the button to login.`,
                      icon: "success",
                      confirmButtonText: "Lets go!",
                    }).then((isConfirmed) => {
                      if (isConfirmed.value === true) navigate("/login");
                    });
                  }
                } catch (e) {
                  if (e.message.slice(e.message.length - 3) == "401") {
                    Swal.fire({
                      title: "Oops!",
                      text: `We could not create your account? Are you entering the correct access token?`,
                      icon: "error",
                      confirmButtonText: "I'll fix it!",
                    });
                  } else {
                    Swal.fire({
                      title: "Oops!",
                      text: `${e.message}`,
                      icon: "error",
                      confirmButtonText: "I'll fix it!",
                    });
                  }
                }
              }}
            >
              <h2 className="form-title">Create account</h2>
              <br />
              <div className="form-group ">
                <label>
                  Enter your access token
                  <br />
                  <input
                    className="form-input"
                    ref={(node) => (accessKey = node)}
                  ></input>
                </label>
              </div>

              <div className="form-group ">
                <label>
                  Enter your Username
                  <br />
                  <input
                    className="form-input"
                    ref={(node) => (userName = node)}
                  ></input>
                </label>
              </div>

              <div className="form-group ">
                <label>
                  Enter your password
                  <br />
                  <input
                    className="form-input"
                    type="password"
                    ref={(node) => (password = node)}
                  ></input>
                </label>
              </div>

              <div className="form-group ">
                <label>
                  Enter your Contact number
                  <br />
                  <input
                    className="form-input"
                    ref={(node) => (contactNo = node)}
                  ></input>
                </label>
              </div>

              <div className="form-row ">
                <div className="form-group col-md-5.5 mb-3 ">
                  <label>Enter your Gender</label>
                  <br />
                  <select
                    className="form-control2"
                    id="gender"
                    name="gender"
                    placeholder="Select Gender"
                    ref={(node) => (gender = node)}
                  >
                    <option value="" class="gray" selected disabled hidden>
                      Select Gender
                    </option>
                    <option value="1">Female</option>
                    <option value="0">Male</option>
                    <option value="2">Other</option>
                  </select>
                  {/* <input
                    class="  form-input "
                    ref={(node) => (gender = node)}
                  ></input> */}
                </div>

                <div className="form-group  col-md-5.5 mb-3">
                  <label>Enter your date of Birth</label>
                  <br />
                  <input
                    className="form-control1 "
                    type="date"
                    ref={(node) => (dob = node)}
                  ></input>
                </div>
              </div>
              <br />

              <button className="btn-lg btn-danger" type="submit">
                Sign Up
              </button>
            </form>
            <p className="loginhere">
              Have already an account ?{" "}
              <Link
                to={`/login`}
                className="loginhere-link"
                variant="contained"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
