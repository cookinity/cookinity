import React from 'react';
import PropTypes from 'prop-types';

import Footer from '../components/Footer/Footer';
import { NavigationBar } from 'components/Navbar/Navbar';
import { Container } from 'react-bootstrap';

const Layout = ({ children }) => {
  return (
    <>
      <NavigationBar />
      <Container>{children}</Container>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
