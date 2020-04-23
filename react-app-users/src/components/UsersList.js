import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'semantic-ui-react';
//import axiosWithAuth  from '../utils/axiosWithAuth.js';
const Users = () => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5050/api/users')
      .then((response) => {
        console.log(response, 'the response')
        setUserList(response.data);
      })
      .catch((err) => (err));
  }, []);

  return (
    <div className="container">
      <h1>Users List</h1>
      <div className="cards-wrapper">
        <Card.Group>
          {userList.map((user) => (
               <Card>
               <Card.Content>
                 <Card.Header>{user.username}</Card.Header>
                 <Card.Header>{user.id}</Card.Header>
               </Card.Content>
               <Card.Content extra>
                 <div className="ui two buttons">
                   <Button basic color="green"> View user </Button>
                 </div>
               </Card.Content>
             </Card>
          ))}
        </Card.Group>
      </div>
    </div>
  );
};

export default Users;