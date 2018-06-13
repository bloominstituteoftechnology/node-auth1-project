import React, { Component } from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false, 
            username: "",
            password: "",
            response: {}
        }
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    // componentDidMount() {
    //     axios.post('http:localhost:3000/register')
    //         .then(response => {
    //             this.setState({register: response.data})
    //         })
    //         .catch(err => {
    //             console.log(err.message);
    //         });
    // }

    newUserInfoHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    createUserHandler = () => {
      axios.post('http://localhost:3000/api/register', {username: this.state.username, password: this.state.password})
            .then(response => {
                console.log(response)
                this.setState({ response })
            })
            .catch(err => {
                console.log(err.message);
            });

        this.setState({username: "", password: ""})


        this.toggle();
    }

    render() {
        return (
            <div>
                <div>
                    <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}Register</Button>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Register Here!</ModalHeader>
                    <ModalBody>
                    <form>
                        <input onChange={this.newUserInfoHandler} type="text" value={this.state.username} placeholder="enter username here" name="username"></input>
                        <input onChange={this.newUserInfoHandler} type="text" value={this.state.password} placeholder="enter password here" name="password"></input>
                        <Button color="primary" onSubmit={this.createUserHandler}>Submit</Button>
                    </form>
                    </ModalBody>
                    <ModalFooter>
    
                    {/* <Button color="secondary" onClick={this.toggle}>Cancel</Button> */}
                    </ModalFooter>
                    </Modal>
                </div>
                {/* {this.state.response ? <div>{this.state.response}</div> : null} */}
            </div>
        )
    }

}

export default Register;


