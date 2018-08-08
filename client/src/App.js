import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import List from './components/List'
import SearchBar from './components/SearchBar'





class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      users: [],
      store: []
    }
  }

  // store: [] is for the search functionality

    componentDidMount() {
    axios
      .get('http://localhost:8000/api/users',  { crossdomain: true })
      .then(response => { console.log(response)
        this.setState({ users: response.data,  store: response.data });
      })
      .catch(error => {
        console.log(`There was an error getting users: ${error}`);
      });
  }

  filterNames(e){
    this.setState({
      users: this.state.store.filter((item) => 
        item.username.toLowerCase().includes(e.target.value.toLowerCase()
          ))
    })
  }



  render() {
    const {users} = this.state
    console.log(users)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Authentication</h1>
        </header>

      <div className="Card">
        <div className="header">NAME LIST</div>
        <SearchBar searchFunc={(e) => this.filterNames(e)}/>
        <List usernames={users}/>
      </div>
      </div>


    );
  }
}

export default App;
