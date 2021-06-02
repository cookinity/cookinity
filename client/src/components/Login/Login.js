import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { withRouter, Redirect } from 'react-router-dom';

import { useFormik } from 'formik';

import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { loginUserWithEmail } from '../../store/features/authentication/authActions';
import { loginSchema } from './validation';

const Login = ({ auth, history, loginUserWithEmail }) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      loginUserWithEmail(values, history);
    },
  });

  if (auth.isAuthenticated) return <Redirect to="/" />;

  return (
    <div className="w-25 p-3 mb-1 bg-secondary text-light">
      <Form onSubmit={formik.handleSubmit} noValidate>
        <p>
          Back to <a href="/">Home page</a>
        </p>

        <h3>Login</h3>
        <div>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email address"
              name="email"
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
          </Form.Group>

          {formik.touched.email && formik.errors.email ? (
            <p className="error">{formik.errors.email}</p>
          ) : null}

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
          </Form.Group>

          {formik.touched.password && formik.errors.password ? (
            <p className="error">{formik.errors.password}</p>
          ) : null}
        </div>

        {auth.error && <p className="error">{auth.error}</p>}

        <Button
          className="btn submit"
          variant="primary"
          type="submit"
          disabled={auth.isLoading || !formik.isValid}
        >
          Log in now
        </Button>

        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>

        <p className="forgot-password">
          Forgot <a href="#">password</a>?
        </p>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default compose(withRouter, connect(mapStateToProps, { loginUserWithEmail }))(Login);
