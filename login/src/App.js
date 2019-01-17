import React, { Component } from 'react';
import './App.css';
import { Route, Link } from 'react-router-dom';


class App extends Component {
  render() {
    return (
      <div className="App">
        <nav className="navBar">
          <Link to="/" cstyle={{textDecoration: 'none', color: 'black'}}>Home</Link>
          <Link to="/smurfs" className="navlink">The Village</Link>
          <Link to="/create" className="navlink">Add a Smurf</Link>
        </nav>

        <Route path="/create" render={ props => <div><AddSmurf/> <SmurfList /></div>} />
        <Route exact path="/" component={Home} />
        <Route exact path="/smurfs" component={SmurfList} />
        <Route path="/smurfs/:id" render={ props => <SmurfProfile {...props} /> } />
        <Route path="/smurfs/:id/update" component={UpdateSmurf} />

      </div>
    );
  }
}

export default App;
