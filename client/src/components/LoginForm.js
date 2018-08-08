import React from 'react';
import styled from 'styled-components';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(45,45,45,0.2);
    justify-content: space-around;
    align-items: center;
    width: 400px;
    height: 250px;
    margin: 50px auto;
    box-shadow: 0 10px 20px rgba(0,0,0,0.16), 0 6px 6px rgba(45,45,45,0.23);
    padding: 0 50px;
`

const Button = styled.button`
    width: 150px;
    background: rgb(0,23,31);
    color: white;
    border: none;
    width: 300px;
    height: 50px;
    font-size: 24px;
`

const Input = styled.input`
    width: 100%;
    border: none;
    border-bottom: 1px solid rgba(45,45,45,0.2);
    &hover {
        border: none;
    }
`

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            username: "",
            password: ""
         }
    }


    render() { 
        return ( 
            <Form className="login-form">
                <Input type="text" placeholder = "Username" required/>
                <Input type="text" placeholder = "Password" required/>
                <Button type="submit">Login</Button>
            </Form>
         );
    }
}
 
export default Login;