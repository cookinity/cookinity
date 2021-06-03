import React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withRouter, Redirect } from 'react-router-dom';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { useFormik } from 'formik';

import { registerUserWithEmail } from '../../store/features/registration/registerActions';
import { registerSchema } from './validation';


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
  
    if (auth.isAuthenticated) return <Redirect to="/" />;
  
    return (
        <div className="w-25 p-3 mb-1 bg-secondary text-light">
         
        <Form onSubmit={formik.handleSubmit} noValidate>
            <p>Back to <a href='/'>Home page</a>
            </p>

            <h3>Create new account</h3>
            <div>
            <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                    placeholder="Enter name" 
                    name="name"
                    pattern=".{2,30}" 
                    required 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                />
            </Form.Group>

            {formik.touched.name && formik.errors.name ? (
              <p className="error">{formik.errors.name}</p>
            ) : null}

            <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                placeholder="Enter username" 
                name="username"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{2,20}" 
                required 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                />                
            </Form.Group>

            {formik.touched.username && formik.errors.username ? (
              <p className="error">{formik.errors.username}</p>
            ) : null}

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
                <small id="passwortHelp" 
                    className="form-text text-muted">Password must be at least 6 characters!
                </small>
            </Form.Group>
            
            {formik.touched.password && formik.errors.password ? (
              <p className="error">{formik.errors.password}</p>
            ) : null}
            </div>

            {error && <p className="error">{error}</p>}
            
            <Button className="btn submit" variant="primary" type="submit" disabled={isLoading || !formik.isValid}>Sign up now</Button>
            
            <p>Have an account? <a href='/login'>Log in</a></p>

            <p className="forgot-password">
                    Forgot <a href="#">password</a>?
            </p>
        </Form>
        </div>
        
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    register: state.register,
  });

export default compose(withRouter, connect(mapStateToProps, { registerUserWithEmail }))(Register);
