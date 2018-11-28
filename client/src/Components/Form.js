import React, { useState } from 'react';
import './Form.css';

const useInputValue = (initialValue) => {
  const [value, setValue] = useState(initialValue)

  return {
    value,
    onChange: e => setValue(e.target.value)
  };
}

export const Form = (props) => {
  const { 
    inputs,
    onSubmit,
    formTitle
  } = props
  const forms = {};
  Object.entries(inputs).forEach(input => {
    forms[input[0]] = useInputValue(input[1])
  })
  // const username = useInputValue(inputs.username)
  // const password = useInputValue(inputs.password)
   return (
    <div className="note-form">
      <form onSubmit={e => {
        e.preventDefault();
        onSubmit(forms)
      }}>
        <h2>{formTitle}</h2>
        {Object.entries.map(input => (
          <input {...input[1]} className={input[0]} />
        ))}
        <button type="submit">login</button>
        </form>
        </div>
        )
      }
      
      /* 
      
      <input {...username} className="title"/>
      <input {...password} className="textBody"/>
*/