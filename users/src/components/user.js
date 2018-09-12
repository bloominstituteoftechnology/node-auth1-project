import React from 'react';
import styled from 'styled-components';

const UsersInfo = styled.div`

    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background: #E0E0E0;
    border-bottom: 1px solid #F8F8F8;

`
const PasswordField = styled.p`
    max-width: 724px;
    width: 100%

`

const UserField = styled.p`
    max-width: 100px;
    width: 100%;
`

const User = (props) => {
    return(
        <UsersInfo>
            <UserField>{props.id}</UserField>
            <UserField>{props.name}</UserField>
            <PasswordField>{props.password}</PasswordField>
            <UserField>{props.generated}</UserField>
        </UsersInfo>
    )
}
export default User;