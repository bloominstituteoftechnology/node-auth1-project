import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField, makeStyles, Link } from "@material-ui/core/";
import { useHistory } from "react-router-dom";

export default function Secret() {
  const [users, setUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then(res => {
        console.log("get res", res);
      })
      .catch(err => {
        console.log("get err", err);
      });
  });

  const handleLogout = e => {
    axios
      .get("http://localhost:5000/api/auth/logout")
      .then(res => {
        console.log("logout res", res);
        history.push("/");
      })
      .catch(err => {
        console.log("logout err", err);
      });
  };

  return (
    <div>
      <h1>THIS IS THE SECRET PAGE</h1>
      <div>
        {users.map(user => (
          <p>{user.username}</p>
        ))}
      </div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
