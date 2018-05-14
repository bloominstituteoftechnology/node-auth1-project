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
                <View users={this.state.users}/>
            </div>
        )
    }
    
}


export default App;


