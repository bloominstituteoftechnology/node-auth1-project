import React from "react";
import UserList from "../view/UserList.js";
import { connect } from "react-redux";
import { fetchUsers } from "../../redux/userList/actions.js";

class UserListContainer extends React.Component {

    componentDidMount() {
        this.props.fetchUsers();
    }

    render() {
        return (
            <div>
                <UserList {...this.props}/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, { fetchUsers })(UserListContainer);