import Rating from 'components/Home/Rating';
import React, { useState } from 'react';
import { Col, Form, InputGroup } from 'react-bootstrap';

const BasicInfoSection = ({ formik,
  setRatingCustomerStar, ratingCustomerStar
}) => {

  return (
    <>
      <div className='col text-center'>
        <Rating rating={ratingCustomerStar} onRating={rate => setRatingCustomerStar(rate)} />
      </div>

      <Form.Group as={Col} controlId="ratingCustomer">
        <Form.Control
          placeholder="Give a short description about the customer"
          as="textarea"
          rows={3}
          name="ratingCustomer"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.ratingCustomer}
          className={formik.touched.ratingCustomer && formik.errors.ratingCustomer ? 'form-error' : null}
        />
        {formik.touched.ratingCustomer && formik.errors.ratingCustomer ? (
          <div className="form-error-message">{formik.errors.ratingCustomer}</div>
        ) : null}
      </Form.Group>
    </>
  );
};

export default BasicInfoSection;
