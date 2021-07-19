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
    </>
  );
};

export default BasicInfoSection;
