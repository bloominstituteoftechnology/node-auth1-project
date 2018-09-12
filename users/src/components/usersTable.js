import React, {Component} from 'react';
import styled from 'styled-components';

const Table = styled.div`
    display: flex;
    justify-content: center;
    max-width: 1024;
    width: 100%;
    border-bottom: 1px solid gray;
`
const Field = styled.div`
    width: 100%;
    max-width: 100px;

`
const Field1 = styled.div`

    max-width: 724px;
    width: 100%;
`

class UsersTable extends Component {
    render() { 
        return ( 
            <Table>
                    <Field><h3>ID</h3></Field>
                    <Field><h3>Name</h3></Field>
                    <Field1><h3>Password</h3></Field1>
                    <Field><h3>Date</h3></Field>
            </Table>
         );
    }
}
 
export default UsersTable;