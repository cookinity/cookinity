import React from 'react';
import { useSelector } from 'react-redux';

import Layout from '../Layout/Layout';
import { Col, Container, Row } from 'react-bootstrap';

export const Home = () => {
  const auth = useSelector((state) => state.auth);

  return (
    <Layout>
      <Row>
        <Col> <div className="users" >
          <p className="text-primary">
            <p className="text-center">
              <p className="font-weight-bold">
                <h1>Cookinity</h1>
              </p>
            </p>
          </p>
        </div></Col>
      </Row>
    </Layout>

  );
};
