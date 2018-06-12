import React from 'react'
import {
    Card, CardImg, CardBody,
    CardTitle, CardSubtitle, CardText
} from 'reactstrap';
import axios from 'axios'

export const UserList = (props) => {
    return (
        <div>
            {props.users.map((e) => {
                return (
                    <Card>
                        <CardImg top width="100%" src={`https://robohash.org/${e.username}.png?size=318x180`} alt="Card image cap" />
                        <CardBody>
                            <CardTitle>{e.username}</CardTitle>
                            <CardSubtitle>{e._id}</CardSubtitle>
                            <CardText>Password: {e.password}</CardText>
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    )
}

UserList.defaultProps = {
    users: []
};