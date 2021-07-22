import React from 'react';
import Form from 'react-bootstrap/Form';
import { withRouter, Redirect } from 'react-router-dom';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { useFormik } from 'formik';

import { registerUserWithEmail } from '../../store/features/registration/registerActions';
import { registerSchema } from './validation';

import cookingclass from './Cooking-Class.jpg';

const Register = ({ auth, register: { isLoading, error }, history, registerUserWithEmail }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      registerUserWithEmail(values, history);
    },
  });

  if (auth.isAuthenticated) return <Redirect to="/home" />;

  return (
    <main>
      <div
        className="preloader bg-dark flex-column justify-content-center align-items-center"
        style={{ display: 'none' }}
      ></div>
      <Form onSubmit={formik.handleSubmit} noValidate>
        <section
          className="min-vh-100 d-flex align-items-center section-image overlay-soft-dark py-5 py-lg-0"
        // data-background=""
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="text-center text-md-center mb-5 mt-md-0 text-white">
                  <h1 className="mb-0 h3">Create an account</h1>
                </div>
              </div>
              <div className="col-12 d-flex align-items-center justify-content-center">
                <div className="signin-inner mt-3 mt-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500"
                  style={{ backgroundImage: `url(${cookingclass})` }}>
                  <p>
                    Back to <a href="/home">Home page</a>
                  </p>

                  <div>
                    <div className="form-group">
                      <label htmlFor="name">Your name</label>
                      <div className="input-group mb-4">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <span className="fa fa-user"></span>
                          </span>
                        </div>
                        <input
                          className="form-control"
                          id="name"
                          placeholder="Enter name"
                          type="text"
                          aria-label="name"
                          required
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.name}
                        />
                      </div>
                    </div>

                    {formik.touched.name && formik.errors.name ? (
                      <p className="error">{formik.errors.name}</p>
                    ) : null}

                    <div className="form-group">
                      <label htmlFor="username">Your username</label>
                      <div className="input-group mb-4">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <span className="fa fa-at"></span>
                          </span>
                        </div>
                        <input
                          className="form-control"
                          id="username"
                          placeholder="Enter username"
                          type="text"
                          aria-label="username"
                          required
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.username}
                        />
                      </div>
                    </div>

                    {formik.touched.username && formik.errors.username ? (
                      <p className="error">{formik.errors.username}</p>
                    ) : null}

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
                          aria-label="email"
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
                      <label htmlFor="password">Your password</label>
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

                      {formik.touched.password && formik.errors.password ? (
                        <p className="error">{formik.errors.password}</p>
                      ) : null}

                      <small id="passwortHelp" className="form-text text-muted">
                        Password must be at least 6 characters!
                      </small>
                    </div>
                  </div>

                  {error && <p className="error">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading || !formik.isValid}
                    className="btn btn-block btn-primary"
                  >
                    Create an account
                  </button>

                  <div className="d-block d-sm-flex justify-content-center align-items-center mt-4">
                    <span className="font-weight-normal">
                      Already have an account?{' '}
                      <a href="/login" className="font-weight-bold">
                        Login here
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
  register: state.register,
});

export default compose(withRouter, connect(mapStateToProps, { registerUserWithEmail }))(Register);
