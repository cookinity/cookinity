import React from 'react';
import PropTypes from 'prop-types';

import { NavigationBar } from 'components/Layout/Navbar/Navbar';
import { Col, Container, Row } from 'react-bootstrap';

const Layout = ({ children }) => {
  return (
    <>
      <NavigationBar />
      <Container fluid>
        <Row noGutters>
          <Col className="mt-4 mb-4" xs={{ span: 10, offset: 1 }}>
            {children}
          </Col>
        </Row>
      </Container>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
