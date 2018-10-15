import React from 'react';
import './Form.css';


const Form = () => {
return (
    <div className = "formcontainer">
        <form>
          <p>Name:</p>
          <input type="text" maxLength="50"></input>
          <p>Password:</p>
          <input type="password" ></input>
          <br/>
          <button>Register</button>
        </form>
        </div>
);
};

// Form.propTypes = {
//     name: React.propTypes.string.isRequired
// };

export default Form;