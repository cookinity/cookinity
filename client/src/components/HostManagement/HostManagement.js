import Layout from 'components/Layout/Layout';
import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { compose } from 'redux';
import requireAuth from '../../higherOrderComponents/requireAuth';

const HostManagement = () => {
  return (
    <Layout>
      <div className="mt-2">
        <LinkContainer to="/hostmanagement/create-class">
          <Button>Host a New Class</Button>
        </LinkContainer>
      </div>
    </Layout>
  );
};

export default compose(requireAuth)(HostManagement);
