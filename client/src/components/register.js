import React from "react";
import { Link } from "react-router-dom";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

function login(props) {
  return (
    <section className="loginComponent">
      <h1 className="heading-primary">Fill the Form to Register</h1>
      <Form className="loginForm">
        <Field
          className="loginForm__field"
          type="text"
          name="username"
          placeholder="username"
        />
        {props.touched.username && props.errors.username && (
          <p className="error">{props.errors.username}</p>
        )}

        <Field
          className="loginForm__field"
          type="password"
          name="password"
          placeholder="password"
        />

        {props.touched.password && props.errors.password && (
          <p className="error">{props.errors.password}</p>
        )}

        <Field
          className="loginForm__field"
          type="password"
          name="passwordVerifty"
          placeholder="verify password"
        />

        {props.touched.passwordVerify && props.errors.passwordVerify && (
          <p className="error">{props.errors.passwordVerify}</p>
        )}

        <div className="loginForm__buttons">
          <button className="btn">Register</button>
          <span>
            OR{" "}
            <Link to="/" className="btn-inline">
              Click to Login
            </Link>
          </span>
        </div>
      </Form>
    </section>
  );
}

const LoginWithFormik = withFormik({
  mapPropsToValues: ({ username, password, passwordVerifty }) => {
    return {
      username: username || "",
      password: password || "",
      passwordVerifty: passwordVerifty || "",
    };
  },

  validationSchema: Yup.object({
    username: Yup.string().required("username is required"),
    password: Yup.string().required("password is required"),
    passwordVerify: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords don't match"
    ),
  }),

  handleSubmit(values, { props, resetForm }) {
    axios
      .post("http://localhost:5300/api/auth/register", {
        username: values.username,
        password: values.password,
      })
      .then((res) => {
        axios
          .post("http://localhost:5300/api/auth/login", {
            username: res.data.username,
            password: values.password,
          })
          .then((loginRes) => {
            console.log(loginRes);
            localStorage.setItem("welcome", loginRes.data.message);
            props.history.push("/dashboard");
          })
          .catch((err) => console.log(err.message));
      })
      .catch((err) => console.log(err.message));

    resetForm();
  },
})(login);

export default LoginWithFormik;
