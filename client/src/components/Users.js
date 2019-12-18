import React, { useState, useEffect } from "react";
import axios from "axios";

function Users() {
  useEffect(() => {
    axios
      .get("https://nodewithsession.herokuapp.com/api/users")
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  return <div>Home</div>;
}

export default Users;
