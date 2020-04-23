import React from "react";
import { Link } from "react-router-dom";
import { withFormik, Form, Field } from "formik";
import axios from "axios";

function login() {
  return (
    <section className="loginComponent">
      <h1 className="heading-primary">Login or Register</h1>
      <Form className="loginForm">
        <Field
          className="loginForm__field"
          type="text"
          name="username"
          placeholder="username"
        />
        <Field
          className="loginForm__field"
          type="password"
          name="password"
          placeholder="password"
        />
        <div className="loginForm__buttons">
          <button className="btn">Login</button>
          <span>
            OR{" "}
            <Link to="/register" className="btn-inline">
              register
            </Link>
          </span>
        </div>
      </Form>
    </section>
  );
}

const LoginWithFormik = withFormik({
  mapPropsToValues: ({ username, password }) => {
    return {
      username: username || "",
      password: password || "",
    };
  },

  handleSubmit(values, { props, resetForm }) {
    axios
      .post("http://localhost:5300/api/auth/login", values)
      .then((res) => {
        localStorage.setItem("welcome", res.data.message);
        props.history.push("/dashboard");
      })
      .catch((err) => console.log(err.message));

    resetForm();
  },
})(login);

export default LoginWithFormik;
