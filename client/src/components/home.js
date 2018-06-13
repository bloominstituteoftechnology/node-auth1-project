import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            wutizit: {}
         }
    }

componentDidMount() {
this.getSession();
};
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
            <div />
         )
    }
}
 
export default Home;