import React from 'react';
import { Form } from 'react-bootstrap';

import { withRouter, Redirect } from 'react-router-dom';

import { useFormik } from 'formik';

import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { loginUserWithEmail } from '../../store/features/authentication/authActions';
import { loginSchema } from './validation';

import cooking1 from './cooking1.jpg';

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

  if (auth.isAuthenticated) return <Redirect to="/home" />;

  return (
    <main style={{ backgroundImage: `url(${cooking1})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div
        className="preloader bg-dark flex-column justify-content-center align-items-center"
        style={{ display: 'none' }}
      ></div>
      <Form onSubmit={formik.handleSubmit} noValidate>
        <section
          className="min-vh-100 d-flex align-items-center section-image overlay-soft-dark py-5 py-lg-0"
        >
          <div className="container" >
            <div className="row justify-content-center" >
              <div className="col-12">
                <div className="text-center text-md-center mb-5 mt-md-0 text-white">
                  <h1 className="mb-0 h3">Sign in to Cookinity</h1>
                </div>
              </div>
              <div className="col-12 d-flex align-items-center justify-content-center">
                <div
                  className="signin-inner mt-3 mt-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500"
                >
                  <p>
                    Back to <a href="/home">Home page</a>
                  </p>

                  <div>
                    <div className="form-group">
                      <label htmlFor="email">Your email</label>
                      <div className="input-group mb-4">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <span className="fa fa-envelope"></span>
                          </span>
                        </div>
                        <input
                          className="form-control"
                          id="email"
                          placeholder="Enter email address"
                          type="text"
                          aria-label="email address"
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
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-group mb-4">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <span className="fa fa-unlock-alt"></span>
                            </span>
                          </div>
                          <input
                            className="form-control"
                            id="password"
                            placeholder="Enter password"
                            type="password"
                            aria-label="password"
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
                  </div>

                  {auth.error && <p className="error">{auth.error}</p>}

                  <button
                    type="submit"
                    className="btn btn-block btn-primary"
                    disabled={auth.isLoading || !formik.isValid}
                  >
                    Sign in
                  </button>

                  <div className="d-block d-sm-flex justify-content-center align-items-center mt-4">
                    <span className="font-weight-normal">
                      Not registered yet?{' '}
                      <a href="/register" className="font-weight-bold">
                        Create account
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Form>
    </main>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default compose(withRouter, connect(mapStateToProps, { loginUserWithEmail }))(Login);
