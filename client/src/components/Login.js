import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import queries from "../queries";
import { useSelector, useDispatch } from "react-redux";
import actions from "../actions";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import store from "../store";
import Swal from "sweetalert2";

const Login = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [loginUser] = useLazyQuery(queries.user.LOGIN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, data } = useQuery(queries.post.GET_ALL);

  useEffect(() => {
    if (data) {
      console.log(data.getAll);
    }
  }, []);

  async function PostData(e) {
    e.preventDefault();

    try {
      const { data } = await loginUser({ variables: { email, password } });
      console.log(data.loginUser);

      if (data.loginUser) {
        dispatch(actions.storeToken(data.loginUser));
        Swal.fire({
          title: "Yay!",
          text: "Successful Login",
          icon: "success",
        });
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Oops!",
        text: error.message,
        icon: "error",
        confirmButtonText: "I'll fix it!",
      });
    }
  }

  return (
    <div class="main1">
      <section class="signup">
        <div class="container1">
          <div class="signup-content">
            <form class="signup-form" onSubmit={PostData}>
              <h2 class="form-title">Login</h2>

              <div class="form-group">
                <label>
                  Enter your email
                  <br />
                  <input
                    class="form-input"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  ></input>
                </label>
              </div>

              <div class="form-group">
                <label>
                  Enter your password
                  <br />
                  <input
                    class="form-input"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  ></input>
                </label>
              </div>
              <br />

              <button class="btn-lg btn-danger" type="submit">
                Log In
              </button>
            </form>
            <p class="loginhere">
              Don't have an account ?
              <Link to={`/signup`} class="loginhere-link" variant="contained">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
