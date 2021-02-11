import React from 'react'
//imports
import { BrowserRouter, Route } from 'react-router-dom'
//components
import Nav from './Nav';
import Users from './Users';

export default function User() {
    return (
        <BrowserRouter>
        	<div>
                <Nav/>
        	    <Route exact path = '/' component = {null}/>
        	    <Route path = '/users' component = {Users}/>
                
        	</div>
        </BrowserRouter>
    )
}
