import React from 'react';
import { Form } from 'react-bootstrap';

const BasicInfoSection = ({ formik }) => {

  return (
    <>
      <Form.Group controlId="OverallRating">
        <Form.Label>Give a short description about your overall experience</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="OverallRating"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          className={formik.touched.description && formik.errors.description ? 'form-error' : null}
        />
        {formik.touched.description && formik.errors.description ? (
          <div className="form-error-message">{formik.errors.description}</div>
        ) : null}
      </Form.Group>
    </>
  );
};

export default BasicInfoSection;
