import React, {Component} from 'react';
import StarWars from './starwars';
import { Button } from 'reactstrap';

class Starwars extends Component {
  constructor() {
    super();
    this.state = {
      starwarsChars: []
    };
  }

  componentDidMount() {
    this.getCharacters('https://swapi.co/api/people/');
  }

  getCharacters = URL => {

    fetch(URL)
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({ starwarsChars: data.results });
      })
      .catch(err => {
        throw new Error(err);
      });
  };

  
  Logout = e => {
    e.preventDefault();
    const user = this.state.username;
    localStorage.removeItem('user', user);
    window.location.reload();
  }

  render() {
    return (
      <div className="starwars">
        <h1 className="Header">Welcome To React Wars Young Padawan! </h1>
        <h3>The Force may still be strong with this one!</h3>
        <Button onClick={this.Logout}>Log Out</Button>
        <StarWars sith={this.state.starwarsChars}/>
      </div>
    );
  }
}
export default Starwars;