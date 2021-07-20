import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

import { logOutUser } from '../../../store/features/authentication/authActions';
import { LinkContainer } from 'react-router-bootstrap';
import './Navbar.scss';
import logo from './CookinityLogo.png';
import name from './Cookinity.png';


export const NavigationBar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  
  const onLogOut = (event) => {
    event.preventDefault();
    dispatch(logOutUser(history));
  };

  let navBarContent;

  if (auth.isAuthenticated) {
    navBarContent = (
      <>
        <LinkContainer to="/hostmanagement">
          <Nav.Link>Host a Class</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/your-bookings">
          <Nav.Link>Your Bookings</Nav.Link>
        </LinkContainer>
        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <LinkContainer to={`/${auth.me.username}`}>
            <NavDropdown.Item>Your Profile</NavDropdown.Item>
          </LinkContainer>
          {auth.me?.role === 'ADMIN' && (
            <LinkContainer to="/admin">
              <NavDropdown.Item>Admin</NavDropdown.Item>
            </LinkContainer>
          )}
          <NavDropdown.Item onClick={onLogOut}>Log Out</NavDropdown.Item>
        </NavDropdown>
      </>
    );
  } else {
    navBarContent = (
      <LinkContainer to="/login">
        <Nav.Link>Login</Nav.Link>
      </LinkContainer>
    );
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadowNav">
      
        <Navbar.Brand href="/"><img src={logo} width="30" height="40" />
        {' '}
        <img src={name} width="140" height="40" />
          </Navbar.Brand>
     
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          {navBarContent}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
