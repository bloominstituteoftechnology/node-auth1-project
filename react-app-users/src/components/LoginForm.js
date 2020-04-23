import React, { useState } from 'react'
import { Link, useHistory} from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react'
import axiosWithAuth  from '../utils/axiosWithAuth.js';

const LoginForm = () => {
    const [userInfo, setUserInfo] = useState('');
    const history = useHistory()  
    const handleChange = e => {
        setUserInfo({
          ...userInfo,
          [e.target.name]: e.target.value,
        })
      }

     const handleSubmit = e => {
        e.preventDefault();
        axiosWithAuth()
            .post('/api/auth/login', userInfo)
            .then(res => {
                console.log(res, "res.data.token")// need to fix the back end and add token there
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('haha', 'ahah');
                localStorage.setItem('userId', res.data.id)
                history.push('/api/users');
            })
            .catch(err => {
                localStorage.removeItem("token");
                console.log('invalid login: ', err);
            });
    };  

    return (
        <div>
            <h2>LogIn</h2>
            <Form onSubmit={handleSubmit}>
            <Form.Field>
                <label>Username</label>
                <input 
                    type='text'
                    name='username'
                    placeholder='Username' 
                    value={userInfo.username}
                    onChange={handleChange}
                />
            </Form.Field>
            <Form.Field>
                <label>Password</label>
                <input 
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={userInfo.password}
                    onChange={handleChange}
                />
            </Form.Field>
            <p>
                    Don't have an account? <Link to="/api/auth/register">Sign up</Link>!
                </p>
            <Button type='submit'>LogIn</Button>
        </Form>
        </div>
  )
}

export default LoginForm;
