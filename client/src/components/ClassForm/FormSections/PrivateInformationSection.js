import React from 'react';
import { Form } from 'react-bootstrap';
import Tooltip from '../Tooltip';

const PrivateInformationSection = ({ formik }) => {
  return (
    <>
      <Form.Group controlId="privateInformation">
        <Form.Label>Contact Information</Form.Label>{' '}
        <Tooltip
          content={
            <span>
              <em>
                Important: This information can only be seen by customers who actually booked the
                course.
              </em>
              <br />
              Please provide the customer with some way to contact you. Helpful would be for example
              a Whatsapp number.
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
          placeholder="You can reach me on WhatsApp under +49XXXXXXX"
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
