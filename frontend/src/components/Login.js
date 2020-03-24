import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import axios from "axios";
import { Button, TextField, makeStyles, Link } from "@material-ui/core/";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  formComp: {
    marginTop: 25
  }
}));

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const [creds, setCreds] = useState({
    username: "",
    password: ""
  });

  const handleLogin = e => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/auth/login", creds)
      .then(res => {
        console.log("sign in res", res);
        history.push("/secret");
      })
      .catch(err => {
        console.log("SIGN IN ERROR: ", err);
        window.alert("Incorrect credentials or user does not exist.");
      });
  };

  const handleChanges = e => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>LOGIN</h1>
      <form className={classes.container} onSubmit={handleLogin}>
        <TextField
          className={classes.formComp}
          required
          label="Username"
          name="username"
          autoFocus
          value={creds.username}
          onChange={handleChanges}
        />
        <TextField
          className={classes.formComp}
          required
          name="password"
          label="Password"
          type="password"
          value={creds.password}
          onChange={handleChanges}
        />
        <Button className={classes.formComp} type="submit">
          Login
        </Button>
      </form>
      <Link className={classes.submit} href="/register" variant="body2">
        {"Don't have an account? Sign Up"}
      </Link>
    </div>
  );
}
