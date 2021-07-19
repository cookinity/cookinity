import Rating from 'components/Home/Rating';
import React, { useState } from 'react';

const BasicInfoSection = ({ formik,
  setRatingNumberOfStars, numberOfStars
}) => {

  return (
    <>
      <div className='col text-center'>
        <Rating rating={numberOfStars} onRating={rate => setRatingNumberOfStars(rate)} />
      </div>
    </>
  );
};

export default BasicInfoSection;
