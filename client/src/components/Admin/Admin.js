import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import requireAdmin from '../../higherOrderComponents/requireAdmin';
import Layout from '../Layout/Layout';

const Admin = () => {
  return (
    <Layout>
      <div className="admin-page">
        <p className="text-primary">
          <p className="text-center">
            <p className="font-weight-bold">
              <h1>Admin Dashboard</h1>
            </p>
          </p>
        </p>
        <p className="text-center">
          This is the Admin page. Only the Admin can access this page. Return back to{' '}
          <Link className="bold" to="/">
            Home
          </Link>
        </p>
      </div>
      <Button variant="dark" size="lg" className="ml-4">Geheimer Knopf ohne Funktion</Button>{' '}
    </Layout>
  );
};

export default requireAdmin(Admin);
