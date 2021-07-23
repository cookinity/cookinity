import React from 'react';
import { NavigationBar } from 'components/Layout/Navbar/Navbar';
import { Col, Container, Row } from 'react-bootstrap';

const LayoutNarrow = ({ children }) => {
  return (
    <>
      <NavigationBar />
      <Container fluid>
        <Row noGutters>
          <Col
            className="mt-4 mb-4 card border-light shadow p-4"
            xs={12}
            lg={{ span: 10, offset: 1 }}
          >
            {children}
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default LayoutNarrow;
