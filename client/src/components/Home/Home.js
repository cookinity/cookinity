import React from 'react';
import { useSelector } from 'react-redux';

import Layout from '../Layout/Layout';
import { Col, Container, Row } from 'react-bootstrap';

export const Home = () => {
  const auth = useSelector((state) => state.auth);

  return (
    <Layout>
      <Container>
        <Row>
          <Col>Hello World</Col>
        </Row>
      </Container>
    </Layout>
  );
};
