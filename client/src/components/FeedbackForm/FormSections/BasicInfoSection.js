import Rating from 'components/Home/Rating';
import React, { useState } from 'react';
import { Col, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './feedbackUser.scss';

const BasicInfoSection = ({ formik }) => {

  const [rating, setRating] = useState(4);

  return (
    <>
      <div>
        <div className='row'>
          <div className='col text-center'>
            <Rating rating={rating} onRating={rate => setRating(rate)} />
          </div>
        </div>
      </div>
      <Form.Group as={Col} controlId="overallRatingStars">
        <Form.Label>Overall</Form.Label>
        <InputGroup>
          <Form.Control
            type="number"
            placeholder="1"
            name="overallRatingStars"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.overallRatingStars}
            className={
              formik.touched.overallRatingStars && formik.errors.overallRatingStars ? 'form-error' : null
            }
          />
        </InputGroup>
        {formik.touched.overallRatingStars && formik.errors.overallRatingStars ? (
          <div className="form-error-message">{formik.errors.overallRatingStars}</div>
        ) : null}
      </Form.Group>

      <Form.Group as={Col} controlId="overallRating">
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

      <Form.Group as={Col} controlId="hostRatingStars">
        <Form.Label>Host</Form.Label>
        <InputGroup>
          <Form.Control
            type="number"
            placeholder="1"
            name="hostRatingStars"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.hostRatingStars}
            className={
              formik.touched.hostRatingStars && formik.errors.hostRatingStars ? 'form-error' : null
            }
          />
        </InputGroup>
        {formik.touched.hostRatingStars && formik.errors.hostRatingStars ? (
          <div className="form-error-message">{formik.errors.hostRatingStars}</div>
        ) : null}
      </Form.Group>

      <Form.Group as={Col} controlId="hostRating">
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

      <Form.Group as={Col} controlId="tasteRatingStars">
        <Form.Label>Taste</Form.Label>
        <InputGroup>
          <Form.Control
            type="number"
            placeholder="1"
            name="tasteRatingStars"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.tasteRatingStars}
            className={
              formik.touched.tasteRatingStars && formik.errors.tasteRatingStars ? 'form-error' : null
            }
          />
        </InputGroup>
        {formik.touched.tasteRatingStars && formik.errors.tasteRatingStars ? (
          <div className="form-error-message">{formik.errors.tasteRatingStars}</div>
        ) : null}
      </Form.Group>

      <Form.Group as={Col} controlId="tasteRating">
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

      <Form.Group as={Col} controlId="locationRatingStars">
        <Form.Label>Location</Form.Label>
        <InputGroup>
          <Form.Control
            type="number"
            placeholder="1"
            name="locationRatingStars"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.locationRatingStars}
            className={
              formik.touched.locationRatingStars && formik.errors.locationRatingStars ? 'form-error' : null
            }
          />
        </InputGroup>
        {formik.touched.locationRatingStars && formik.errors.locationRatingStars ? (
          <div className="form-error-message">{formik.errors.locationRatingStars}</div>
        ) : null}
      </Form.Group>

      <Form.Group as={Col} controlId="locationRating">
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

      <Form.Group as={Col} controlId="vtmrRatingStars">
        <Form.Label>Value to Money Ratio</Form.Label>
        <InputGroup>
          <Form.Control
            type="number"
            placeholder="1"
            name="vtmrRatingStars"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.vtmrRatingStars}
            className={
              formik.touched.vtmrRatingStars && formik.errors.vtmrRatingStars ? 'form-error' : null
            }
          />
        </InputGroup>
        {formik.touched.vtmrRatingStars && formik.errors.vtmrRatingStars ? (
          <div className="form-error-message">{formik.errors.vtmrRatingStars}</div>
        ) : null}
      </Form.Group>

      <Form.Group as={Col} controlId="vtmrRating">
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

      <Form.Group as={Col} controlId="experienceRatingStars">
        <Form.Label>Experience</Form.Label>
        <InputGroup>
          <Form.Control
            type="number"
            placeholder="1"
            name="experienceRatingStars"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.experienceRatingStars}
            className={
              formik.touched.experienceRatingStars && formik.errors.experienceRatingStars ? 'form-error' : null
            }
          />
        </InputGroup>
        {formik.touched.experienceRatingStars && formik.errors.experienceRatingStars ? (
          <div className="form-error-message">{formik.errors.experienceRatingStars}</div>
        ) : null}
      </Form.Group>

      <Form.Group as={Col} controlId="experienceRating">
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
