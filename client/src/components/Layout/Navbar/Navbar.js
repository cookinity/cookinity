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

  let isHost = false;
  if (auth && auth.me) {
    isHost = auth.me.hasStripeAccount;
  }

  const onLogOut = (event) => {
    event.preventDefault();
    dispatch(logOutUser(history));
  };

  let navBarContentRight;
  let navBarContentLeft;

  if (auth.isAuthenticated) {
    navBarContentLeft = (
      <>
        <LinkContainer to="/hostmanagement">
          <Nav.Link>{isHost ? 'Manage Your Classes' : 'Become A Host'}</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/your-bookings">
          <Nav.Link>Your Booked Classes</Nav.Link>
        </LinkContainer>
      </>
    );
    navBarContentRight = (
      <>
        <LinkContainer to={`/${auth.me.username}`}>
          <Nav.Link>Your Profile</Nav.Link>
        </LinkContainer>
        <Nav.Link onClick={onLogOut}>Log Out</Nav.Link>
      </>
    );
  } else {
    navBarContentLeft = (
      <LinkContainer to="/login">
        <Nav.Link>Login</Nav.Link>
      </LinkContainer>
    );
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadowNav">
      <Navbar.Brand href="/">
        <img src={logo} width="30" height="40" /> <img src={name} width="140" height="40" />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/home">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          {navBarContentLeft}
        </Nav>
        <Nav>{navBarContentRight}</Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
