import LayoutNarrow from 'components/Layout/LayoutNarrow';
import React from 'react';
import { Link } from 'react-router-dom';

import Layout from '../Layout/Layout';
import './styles.scss';

const NotFound = () => {
  return (
    <LayoutNarrow>
      <div className="not-found-page">
        <h1>Not Found 404</h1>
        <p>
          Go back to{' '}
          <Link className="bold" to="/">
            Home
          </Link>
        </p>
      </div>
    </LayoutNarrow>
  );
};

export default NotFound;
