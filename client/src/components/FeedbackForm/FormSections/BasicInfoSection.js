import Rating from 'components/Home/Rating';
import React, { useState } from 'react';
import { Col, Form, InputGroup } from 'react-bootstrap';

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
      <div className="row">
        <h3 className='col text-center'>Overall Rating</h3>
        <h3 className='col text-center'>Host Rating</h3>
      </div>

      <div className="row">
        <div className='col text-center'>
          <Rating rating={overallRatingStars} onRating={rate => setRatingOverallRatingStars(rate)} />
        </div>
        <div className='col text-center'>
          <Rating rating={hostRatingStars} onRating={rate => setRatingHostStars(rate)} />
        </div>
      </div>

      <div className="row">
        <h3 className='col text-center'>Taste Rating</h3>
        <h3 className='col text-center'>Location Rating</h3>
      </div>

      <div className='row'>
        <div className='col text-center'>
          <Rating rating={tasteRatingStars} onRating={rate => setRatingTasteStars(rate)} />
        </div>
        <div className='col text-center'>
          <Rating rating={locationRatingStars} onRating={rate => setRatingLocationStars(rate)} />
        </div>
      </div>

      <div className="row">
        <h3 className='col text-center'>Value to money ratio</h3>
        <h3 className='col text-center'>Experience Rating</h3>
      </div>

      <div className='row'>
        <div className='col text-center'>
          <Rating rating={vtmrRatingStars} onRating={rate => setRatingVtmrStars(rate)} />
        </div>
        <div className='col text-center'>
          <Rating rating={experienceRatingStars} onRating={rate => setRatingExperienceStars(rate)} />
        </div>
      </div>

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
    </>
  );
};

export default BasicInfoSection;
