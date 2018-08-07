import React from 'react';
import '../App.css';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  render() {
    return (
      <div>
          <h1>Log in</h1>
            <Form>
                <FormGroup>
                    <Label>Username:</Label>
                    <Input
                        name="username"
                        placeholder="Username"
                        // onChange={}
                        value={this.state.username}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Password:</Label>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        // onChange={}
                        value={this.state.password}
                    />
                </FormGroup>
                <Button>Log in</Button>
            </Form>
      </div>
    );
  }
}

export default Login;