import React from 'react';
import PropTypes from 'prop-types';

import { NavigationBar } from 'components/Layout/Navbar/Navbar';
import { Container } from 'react-bootstrap';

const Layout = ({ children }) => {
  return (
    <>
      <NavigationBar />
      <Container>{children}</Container>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
