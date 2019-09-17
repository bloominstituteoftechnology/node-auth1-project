import React, {useState} from 'react'
import axios from 'axios'
axios.defaults.withCredentials = true;

const Register = () => {
    const [newUser, setNewUser] = useState({
        username: "",
        password: ""
    })


const handleChange = e => {
    setNewUser({
        ...newUser, [e.target.name]: e.target.value
    })
}

const RegisterUser = e => {
    e.preventDefault()
    axios
    .post('http://localhost:5000/api/auth/register', newUser)
    .then(res => {
        console.log(res)
    })
    .catch(error => {
        console.log(error.response)
    })
}
    
return (
    <div>
        <form onSubmit={RegisterUser}>
            <input
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleChange}
            />
            <input
                type="text"
                name="password"
                value={newUser.password}
                onChange={handleChange}
            />
            <button>Register</button>
        </form>
    </div>
    )
}

export default Register