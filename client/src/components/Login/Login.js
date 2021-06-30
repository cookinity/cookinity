import React from 'react';
import { Form, Button } from 'react-bootstrap';

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
    <div className="card mb-3 mx-auto shadow " style={{ width: 500 }}>
      <Form onSubmit={formik.handleSubmit} noValidate>
        <div id="main" className="container">
          <div className="mt-2">
            <p>
              Back to <a href="/">Home page</a>
            </p>

            <h4 className="text-center">Login</h4>

            <div>
              <div className="form-group">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fa fa-envelope"></i>
                    </span>
                  </div>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email address"
                    name="email"
                    required
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                </div>
              </div>

              {formik.touched.email && formik.errors.email ? (
                <p className="error">{formik.errors.email}</p>
              ) : null}
              <div className="form-group">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fa fa-key"></i>
                    </span>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    name="password"
                    required
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                </div>
              </div>

              {formik.touched.password && formik.errors.password ? (
                <p className="error">{formik.errors.password}</p>
              ) : null}
            </div>

            {auth.error && <p className="error">{auth.error}</p>}

            <Button
              className="btn submit text-center"
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
          </div>
        </div>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default compose(withRouter, connect(mapStateToProps, { loginUserWithEmail }))(Login);
