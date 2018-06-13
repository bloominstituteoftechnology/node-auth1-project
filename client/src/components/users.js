import React, { Component } from "react";
import axios from "axios";
import { Col, Card, CardBody, CardColumns, Container } from "reactstrap";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wutizit: []
    };
  }

  componentDidMount() {
    this.getSession();
  }
  getSession = () => {
    axios
      .get(`http://localhost:8000/`)
      .then(res => {
        console.log(res.data);
        this.setState({ wutizit: res.data });
      })
      .catch(error => {
        console.log({ error: error.message });
      });
  };

  render() {
    return (
      <div>
        <Container style={{ display: "flex", justifyContent: 'center', }} >
        <CardColumns>
          {this.state.wutizit.map(user => {
            return (
            <Card key={user._id} style={{ margin: '20px', boxShadow: '2px 2px 6px black'}} >
           <CardBody>
               <h4>User:</h4>
            <p style={{ fontSize: '1.3rem'}}>{user.username}</p>
            <a href="#">Profile</a>
           </CardBody>
            </Card>
          )})}
        </CardColumns>
      </Container>
      </div>
    );
  }
}

export default Users;
