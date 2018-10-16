import React from 'react';
import './Login.css';

class Login extends React.Component {
    constructor(){
        super();
        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        return(
            <div className='center'>
                <div className='card'>
                    <h1>Login</h1>
                    <form>
                        <input 
                        className="form-item"
                        type='text' 
                        placeholder='Username...' 
                        name='username' 
                        onChange={this.handleChange}
                    />
                    <input 
                        className="form-item"
                        type='password' 
                        placeholder='Password...' 
                        name='password' 
                        onChange={this.handleChange}
                    />
                    <input
                        className='form-submit'
                        value='SUBMIT'
                        type='submit'
                    />
                    </form>
                </div>
            </div>
        )
    }
    handleChange(e){
        this.setState({
            [e.target.name]:e.target.value
        })
    }
}

export default Login;