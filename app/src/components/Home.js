import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

class Home extends React.Component{
    render(){
        if(this.props.loggedIn){
            axios
                .get('http://localhost:8000/greet')
                    .then(message=>{
                        return(
                            <div>{message}</div>
                        )
                    })
                    .catch(err => console.log(err.message));
            return<div>Hello {this.props.username}.</div>
        }else{
            return(
                <div>Hello there.</div>
            )
        }
    }
}

const mapDispatchToProps = state =>({
    loggedIn: state.loggedIn,
    username: state.username
});

export default connect(mapDispatchToProps)(Home);