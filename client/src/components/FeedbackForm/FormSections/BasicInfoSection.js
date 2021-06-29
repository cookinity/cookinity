import Rating from 'components/Home/Rating';
import React, { useState } from 'react';
import { Col, Form, InputGroup } from 'react-bootstrap';

import './feedbackUser.scss';

const BasicInfoSection = ({ formik,
  setRatingOverallRatingStars, overallRatingStars,
  setRatingHostStars, hostRatingStars,
  setRatingTasteStars, tasteRatingStars,
  setRatingLocationStars, locationRatingStars,
  setRatingVtmrStars, vtmrRatingStars,
  setRatingExperienceStars, experienceRatingStars
}) => {

  return (
    <>
      <Form.Group as={Col} controlId="overallRatingStars">
        <h3 className='col text-center'>Overall Rating</h3>
        <div className='row'>
          <div className='col text-center'>
            <Rating rating={overallRatingStars} onRating={rate => setRatingOverallRatingStars(rate)} />
          </div>
        </div>
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
        <h3 className='col text-center'>Host Rating</h3>
        <div className='row'>
          <div className='col text-center'>
            <Rating rating={hostRatingStars} onRating={rate => setRatingHostStars(rate)} />
          </div>
        </div>
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
        <h3 className='col text-center'>Taste Rating</h3>
        <div className='row'>
          <div className='col text-center'>
            <Rating rating={tasteRatingStars} onRating={rate => setRatingTasteStars(rate)} />
          </div>
        </div>
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
        <h3 className='col text-center'>Location Rating</h3>
        <div className='row'>
          <div className='col text-center'>
            <Rating rating={locationRatingStars} onRating={rate => setRatingLocationStars(rate)} />
          </div>
        </div>
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
        <h3 className='col text-center'>Value to money ratio</h3>
        <div className='row'>
          <div className='col text-center'>
            <Rating rating={vtmrRatingStars} onRating={rate => setRatingVtmrStars(rate)} />
          </div>
        </div>
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
        <h3 className='col text-center'>Experience Rating</h3>
        <div className='row'>
          <div className='col text-center'>
            <Rating rating={experienceRatingStars} onRating={rate => setRatingExperienceStars(rate)} />
          </div>
        </div>
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
