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

export default function Register() {
  const classes = useStyles();
  const history = useHistory();

  const [newUser, setNewUser] = useState({
    username: "",
    password: ""
  });

  const handleChanges = e => {
    e.preventDefault();
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleRegister = e => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/auth/register", newUser)
      .then(res => {
        console.log("register res", res.data);
        history.push("/");
      })
      .catch(err => {
        console.log("REGISTER ERROR: ", err);
        window.alert("Error creating user");
      });
  };

  return (
    <div>
      <h1>REGISTER</h1>
      <form className={classes.container} onSubmit={handleRegister}>
        <TextField
          className={classes.formComp}
          required
          label="Username"
          name="username"
          autoFocus
          value={newUser.username}
          onChange={handleChanges}
        />
        <TextField
          className={classes.formComp}
          required
          name="password"
          label="Password"
          type="password"
          value={newUser.password}
          onChange={handleChanges}
        />
        <Button className={classes.formComp} type="submit">
          Register
        </Button>
      </form>
      <Link className={classes.submit} href="/" variant="body2">
        {"Already have an account? Sign In"}
      </Link>
    </div>
  );
}
