import React from 'react';
import PropTypes from 'prop-types';
import Footer from './Footer';

import { NavigationBar } from 'components/Layout/Navbar/Navbar';
import { Col, Container, Row } from 'react-bootstrap';

const Layout = ({ children }) => {
  return (
    <>
      <NavigationBar />

      <Container fluid>
        <Row noGutters>
          <Col className="mt-2 mx-5">{children}</Col>
        </Row>
      </Container>
      <Footer></Footer>
    </>
  );
};

export default Layout;
