import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "./axiosWithAuth";

function App() {
  const [register, setRegister] = useState({
    username: "",
    password: "",
  });

  const handleChange = e => {
    setRegister({
      ...register,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    axios().post("http://localhost:5000/register/", register)
      .then(result => {
        console.log(result);
        // localStorage.setItem("ID", result.data.id);
        // localStorage.setItem(
        //   "name",
        //   document.getElementById("username-input").value,
        // );
        // localStorage.setItem("token", result.data.token);
        // window.location = "/dashboard";
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className="App">
      <form onSubmit={onSubmit}>
        <input type='text' placeholder='Username' name='username' onChange={handleChange}/>
        <input type='password' placeholder='Password' name='password' onChange={handleChange}/>
        <button>Register</button>
      </form>
    </div>
  );
}

export default App;
