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
    <div class="main">
      <section class="signup">
        <div class="container1">
          <div class="signup-content">
            <form
              class="signup-form"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
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
                  console.log(e);
                  Swal.fire({
                    title: "Oops!",
                    text: `${e.message}`,
                    icon: "error",
                    confirmButtonText: "I'll fix it!",
                  });
                }
              }}
            >
              <h2 class="form-title">Create account</h2>
              <br />
              <div class="form-group ">
                <label>
                  Enter your access token
                  <br />
                  <input
                    class="form-input"
                    ref={(node) => (accessKey = node)}
                  ></input>
                </label>
              </div>

              <div class="form-group ">
                <label>
                  Enter your Username
                  <br />
                  <input
                    class="form-input"
                    ref={(node) => (userName = node)}
                  ></input>
                </label>
              </div>

              <div class="form-group ">
                <label>
                  Enter your password
                  <br />
                  <input
                    class="form-input"
                    type="password"
                    ref={(node) => (password = node)}
                  ></input>
                </label>
              </div>

              <div class="form-group ">
                <label>
                  Enter your Contact number
                  <br />
                  <input
                    class="form-input"
                    ref={(node) => (contactNo = node)}
                  ></input>
                </label>
              </div>

              <div class="form-row ">
              <div class="form-group col-md-5.5 mb-3 ">
                <label>
                  Enter your Gender
                  </label>
                  <br />
                  <select class="form-control2" id="gender" name="gender" placeholder="Select Gender"  ref={(node) => (gender = node)}>
                              <option value="" class="gray" selected disabled hidden>Select Gender</option>
                              <option value="1">Female</option>
                              <option value="0">Male</option>
                              <option value="2">Other</option>
                            </select>
                  {/* <input
                    class="  form-input "
                    ref={(node) => (gender = node)}
                  ></input> */}
                
              </div>

              
              <div class="form-group  col-md-5.5 mb-3">
                <label>
                  Enter your date of Birth
                  </label>
                  <br />
                  <input
                    class="form-control1 "
                    type="date"
                    ref={(node) => (dob = node)}
                  ></input>
                
              </div>
              </div>
              <br />

              <button class="btn-lg btn-danger" type="submit">
                Sign Up
              </button>
            </form>
            <p class="loginhere">
              Have already an account ?{" "}
              <Link to={`/login`} class="loginhere-link" variant="contained">
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
