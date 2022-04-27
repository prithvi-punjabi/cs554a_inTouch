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
  const [loginUser] = useLazyQuery(
    queries.user.LOGIN,
    {
      enabled: false,
    },
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const { loading, error, data } = useQuery(queries.post.GET_ALL);

  // useEffect(() => {
  //   if (data) {
  //     console.log(data.getAll);
  //   }
  // }, []);

  async function PostData(e) {
    e.preventDefault();

    try {
      const { data } = await loginUser({ variables: { email, password } });
      if (data.loginUser === null) {
        throw new Error("Either username or password is invalid");
      }
      if (data.loginUser && data.loginUser !== null) {
        dispatch(actions.storeToken(data.loginUser));
        localStorage.setItem("token", data.loginUser);
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
    <div className="main1">
      <section className="signup">
        <div className="container1">
          <div className="signup-content">
            <form className="signup-form" onSubmit={PostData}>
              <h2 className="form-title">Login</h2>

              <div className="form-group">
                <label>
                  Enter your email
                  <br />
                  <input
                    className="form-input"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  ></input>
                </label>
              </div>

              <div className="form-group">
                <label>
                  Enter your password
                  <br />
                  <input
                    className="form-input"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  ></input>
                </label>
              </div>
              <br />

              <button className="btn-lg btn-danger" type="submit">
                Log In
              </button>
            </form>
            <p className="loginhere">
              Don't have an account ?
              <Link
                to={`/signup`}
                className="loginhere-link"
                variant="contained"
              >
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
