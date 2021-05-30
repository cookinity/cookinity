import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';

import { useFormik } from 'formik';

import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { loginUserWithEmail } from '../../store/features/authentication/authActions';
import { loginSchema } from './validation';
import './styles.scss';

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
    <div className="login">
      <div className="container">
        <h1>Log in page</h1>
        <p>
          back to{' '}
          <Link className="bold" to="/">
            Home page
          </Link>
        </p>
        <form onSubmit={formik.handleSubmit}>
          <h2>Login with email address</h2>
          <div>
            <input
              placeholder="Email address"
              name="email"
              className="text"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="error">{formik.errors.email}</p>
            ) : null}
            <input
              placeholder="Password"
              name="password"
              type="password"
              className="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="error">{formik.errors.password}</p>
            ) : null}
          </div>
          {auth.error && <p className="error">{auth.error}</p>}
          <div>
            <button
              className="btn submit"
              disabled={auth.isLoading || !formik.isValid}
              type="submit"
            >
              Log in now
            </button>
          </div>
          <div>
            Don't have an account?{' '}
            <Link className="bold" to="/register">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default compose(withRouter, connect(mapStateToProps, { loginUserWithEmail }))(Login);