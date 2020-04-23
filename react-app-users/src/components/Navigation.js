import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink, NavbarBrand, Navbar } from 'reactstrap';
import { Icon } from 'semantic-ui-react';

const Navigation = () => (
  <div className="navigation">
    <Navbar>
      <NavbarBrand tag={Link} to="/" className="mr-auto">
       Users keeper
      </NavbarBrand>
      <NavLink tag={Link} to="/api/auth/register">Register</NavLink>
      <NavLink tag={Link} to="/api/auth/login">LogIn</NavLink>
      <NavLink tag={Link} to="/api/users">Users</NavLink>
      <NavLink tag={Link} to="/">
        <Icon name="home" size="big" alternate outline />
      </NavLink>
    </Navbar>
  </div>
);
export default Navigation;