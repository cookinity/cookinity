import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

import { logOutUser } from '../../../store/features/authentication/authActions';
import { LinkContainer } from 'react-router-bootstrap';

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
        <LinkContainer to="/users">
          <Nav.Link>Users</Nav.Link>
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
    <Navbar bg="primary" variant="dark" expand="lg">
      <LinkContainer to="/">
        <Navbar.Brand>Cookinity</Navbar.Brand>
      </LinkContainer>
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
