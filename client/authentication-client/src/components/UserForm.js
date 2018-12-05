import React from 'react';
import './UserForm.css';

class UserForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="userFormContainer">
        <div className="UserForm">
          <form
            className="formFields"
            onSubmit={this.props.addUser}>
            <h2>New user registration:</h2>
            <input
              className='inputFields'
              onChange={this.props.handleInputChange}
              placeholder='username'
              value={this.props.newUser.name}
              name='username'
            />
            <input
              className='inputFields'
              onChange={this.props.handleInputChange}
              placeholder='password'
              value={this.props.newUser.password}
              name='password'
            />
            <button type='submit'className='button'>
              Submit 
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default UserForm;