import React, {Component} from 'react';


class App extends Component {
    constructor() {
        super();

        this.state = {
            users: []
        }
    }

    componentDidMount() {
        this.setState({ users: users})
    }

    render() {
        return (
            <div>
               <Navigation />
               <Route exact path ="/" component={Login} />
               <Route path="/Login" component={Login} />
               <Route path="/View" component={View} />
               <Route path="/Index" compoent={index} />
            </div>
        )
    }
    
}


export default App;


