import React from 'react';
import { Form, Col } from 'react-bootstrap';
import Tooltip from '../Tooltip.js';

const AddressSection = ({ formik }) => {
  return (
    <>
      <Form.Label>Public Meeting Address</Form.Label>{' '}
      <Tooltip
        content="Provide a PUBLIC address where you will meet your guests to then accompany them to your PRIVATE address"
        direction="right"
      >
        <i className="fa fa-question" data-toggle="tooltip"></i>
      </Tooltip>
      <Form.Group controlId="country">
        <Form.Label>Country</Form.Label>{' '}
        <Form.Control
          placeholder="Germany"
          name="country"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.country}
          className={formik.touched.country && formik.errors.country ? 'form-error' : null}
        />
        {formik.touched.country && formik.errors.country ? (
          <div className="form-error-message">{formik.errors.country}</div>
        ) : null}
      </Form.Group>
      <Form.Row>
        <Form.Group as={Col} controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            placeholder="City"
            name="city"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.city}
            className={formik.touched.city && formik.errors.city ? 'form-error' : null}
          />
          {formik.touched.city && formik.errors.city ? (
            <div className="form-error-message">{formik.errors.city}</div>
          ) : null}
        </Form.Group>

        <Form.Group as={Col} controlId="state">
          <Form.Label>State</Form.Label>
          <Form.Control
            placeholder="State"
            name="state"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.state}
            className={formik.touched.state && formik.errors.state ? 'form-error' : null}
          />
          {formik.touched.state && formik.errors.state ? (
            <div className="form-error-message">{formik.errors.state}</div>
          ) : null}
        </Form.Group>

        <Form.Group as={Col} controlId="zip">
          <Form.Label>Zip</Form.Label>
          <Form.Control
            placeholder="Zip"
            name="zip"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.zip}
            className={formik.touched.zip && formik.errors.zip ? 'form-error' : null}
          />
          {formik.touched.zip && formik.errors.zip ? (
            <div className="form-error-message">{formik.errors.zip}</div>
          ) : null}
        </Form.Group>
      </Form.Row>
      <Form.Group controlId="street">
        <Form.Label>Street</Form.Label>
        <Form.Control
          placeholder="TastyStreet 11"
          name="street"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.street}
          className={formik.touched.street && formik.errors.street ? 'form-error' : null}
        />
        {formik.touched.street && formik.errors.street ? (
          <div className="form-error-message">{formik.errors.street}</div>
        ) : null}
      </Form.Group>
    </>
  );
};

export default AddressSection;
