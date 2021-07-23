import React from 'react';
import { Form } from 'react-bootstrap';
import Tooltip from '../Tooltip';

const PrivateInformationSection = ({ formik }) => {
  return (
    <>
      <Form.Group controlId="privateInformation">
        <Form.Label>Optional Private Information For Guests</Form.Label>
        <Tooltip
          content={
            <span>
              <em>This information can only be seen by customers who actually booked the course.</em>
              <br />
              Information that you can provide here are for example your name, email address, phone
              number, etc.
            </span>
          }
          direction="right"
        >
          <i className="fa fa-question" data-toggle="tooltip"></i>
        </Tooltip>
        <Form.Control
          as="textarea"
          rows={3}
          name="privateInformation"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.privateInformation}
          className={
            formik.touched.privateInformation && formik.errors.privateInformation
              ? 'form-error'
              : null
          }
        />
        {formik.touched.privateInformation && formik.errors.privateInformation ? (
          <div className="form-error-message">{formik.errors.privateInformation}</div>
        ) : null}
      </Form.Group>
    </>
  );
};

export default PrivateInformationSection;
