import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
axios.defaults.withCredentials = true;

const Content = styled.div`
    width: 50%;
    margin: auto;
`

const Table = styled.table`
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
`

const Td = styled.td`
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
`

const Th = styled.th`
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
`

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            isAuthenticated: false
        }
    }

    componentDidMount() {
        console.log('here');
        this.fetchUsers();
    }

    fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/restricted/users/');
            this.setState({
                users: response.data,
                isAuthenticated: true
            });
        } catch (error) {
            this.setState({ isAuthenticated: false });
        }
    }

    render() {
        const userTable = (
            <Table>
                <thead>
                    <tr>
                        <Th>User</Th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.users.map((user, index)=><tr key={index}><Td>{user.username}</Td></tr>)}
                </tbody>
            </Table>
        );

        const warning = <h3>You are unauthorized to see this content</h3>;
        return (
            <Content>
                {this.state.isAuthenticated ? userTable : warning}   
            </Content>         
        );
    }
}

export default UserList;