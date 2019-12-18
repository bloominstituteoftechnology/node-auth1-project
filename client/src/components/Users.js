import React, { useState, useEffect } from "react";
import axios from "axios";

function Users() {
  useEffect(() => {
    console.log("qeewqr");
    axios
      .get("https://nodewithsession.herokuapp.com/api/users")
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  return <div>Hmoe</div>;
}

export default Users;
