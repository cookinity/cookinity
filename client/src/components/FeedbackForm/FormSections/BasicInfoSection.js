import React from 'react';
import { Col, Form, InputGroup } from 'react-bootstrap';
import './feedbackUser.scss';

const BasicInfoSection = ({ formik }) => {

  return (
    <>
      <Form.Group as={Col} controlId="overallrankingstars">
        <InputGroup>
          <Form.Control
            type="number"
            placeholder="1"
            name="overallrankingstars"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.overallrankingstars}
            className={
              formik.touched.overallrankingstars && formik.errors.overallrankingstars ? 'form-error' : null
            }
          />
        </InputGroup>
        {formik.touched.overallrankingstars && formik.errors.overallrankingstars ? (
          <div className="form-error-message">{formik.errors.overallrankingstars}</div>
        ) : null}
      </Form.Group>

      <Form.Group as={Col} controlId="overallRating">
        <Form.Label>Overall</Form.Label>
        <Form.Control
          placeholder="Give a short description about your overall experience"
          as="textarea"
          rows={3}
          name="overallRating"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.overallRating}
          className={formik.touched.overallRating && formik.errors.overallRating ? 'form-error' : null}
        />
        {formik.touched.overallRating && formik.errors.overallRating ? (
          <div className="form-error-message">{formik.errors.overallRating}</div>
        ) : null}
      </Form.Group>

      <Form.Group as={Col} controlId="hostRating">
        <Form.Label>Host</Form.Label>
        <Form.Control
          placeholder="Give a short feedback about the host"
          as="textarea"
          rows={3}
          name="hostRating"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.hostRating}
          className={formik.touched.hostRating && formik.errors.hostRating ? 'form-error' : null}
        />
        {formik.touched.hostRating && formik.errors.hostRating ? (
          <div className="form-error-message">{formik.errors.hostRating}</div>
        ) : null}
      </Form.Group>

      <Form.Group as={Col} controlId="tasteRating">
        <Form.Label>Taste</Form.Label>
        <Form.Control
          placeholder="Give a short feedback about the taste of the food"
          as="textarea"
          rows={3}
          name="tasteRating"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.tasteRating}
          className={formik.touched.tasteRating && formik.errors.tasteRating ? 'form-error' : null}
        />
        {formik.touched.tasteRating && formik.errors.tasteRating ? (
          <div className="form-error-message">{formik.errors.tasteRating}</div>
        ) : null}
      </Form.Group>

      <Form.Group as={Col} controlId="locationRating">
        <Form.Label>Location</Form.Label>
        <Form.Control
          placeholder="Give a short feedback about the location"
          as="textarea"
          rows={3}
          name="locationRating"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.locationRating}
          className={formik.touched.locationRating && formik.errors.locationRating ? 'form-error' : null}
        />
        {formik.touched.locationRating && formik.errors.locationRating ? (
          <div className="form-error-message">{formik.errors.locationRating}</div>
        ) : null}
      </Form.Group>

      <Form.Group as={Col} controlId="vtmrRating">
        <Form.Label>Value to money Ratio</Form.Label>
        <Form.Control
          placeholder="Give a short feedback about the Value to money Ratio"
          as="textarea"
          rows={3}
          name="vtmrRating"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.vtmrRating}
          className={formik.touched.vtmrRating && formik.errors.vtmrRating ? 'form-error' : null}
        />
        {formik.touched.vtmrRating && formik.errors.vtmrRating ? (
          <div className="form-error-message">{formik.errors.vtmrRating}</div>
        ) : null}
      </Form.Group>

      <Form.Group as={Col} controlId="experienceRating">
        <Form.Label>Experience</Form.Label>
        <Form.Control
          placeholder="Give a short feedback about your gained cooking experience"
          as="textarea"
          rows={3}
          name="experienceRating"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.experienceRating}
          className={formik.touched.experienceRating && formik.errors.experienceRating ? 'form-error' : null}
        />
        {formik.touched.experienceRating && formik.errors.experienceRating ? (
          <div className="form-error-message">{formik.errors.experienceRating}</div>
        ) : null}
      </Form.Group>
    </>
  );
};

export default BasicInfoSection;
