import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { validationSchema } from './feedbackValidation';
import _ from 'lodash';
import BasicInfoSection from './FormSections/BasicInfoSection';

const FeedbackForm = ({ submitCallback }) => {
  const history = useHistory();

  //ToDo: Discuss if we really want that much feedback. Maybe only stars and overall feedback?
  const formik = useFormik({
    initialValues: {
      overallRatingStars: '',
      overallRating: '',
      hostRatingStars: '',
      hostRating: '',
      tasteRatingStars: '',
      tasteRating: '',
      locationRatingStars: '',
      locationRating: '',
      vtmrRatingStars: '',
      vtmrRating: '',
      experienceRatingStars: '',
      experienceRating: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const submit = async () => {
        try {
          const {
            overallRatingStars,
            overallRating,
            hostRatingStars,
            hostRating,
            tasteRatingStars,
            tasteRating,
            locationRatingStars,
            locationRating,
            vtmrRatingStars,
            vtmrRating,
            experienceRatingStars,
            experienceRating,
          } = values;
          const newFeedback = {
            overallRatingStars,
            overallRating,
            hostRatingStars,
            hostRating,
            tasteRatingStars,
            tasteRating,
            locationRatingStars,
            locationRating,
            vtmrRatingStars,
            vtmrRating,
            experienceRatingStars,
            experienceRating,
          };

          // calling submit callback from parent component
          await submitCallback(newFeedback);
          resetForm();
          // ToDo: Think about a better route to navigate to!
          history.push('/hostmanagement');
        } catch (err) {
          // error happened in parent component --> do not clear form
        }
      };
      submit();
    },
  });

  return (
    <>
      {<h1>Feedback</h1>}
      <Form className="mx-auto" onSubmit={formik.handleSubmit} noValidate>
        <BasicInfoSection formik={formik}></BasicInfoSection>
        <hr></hr>
        <Button variant="primary" type="submit">
          {'Submit Feedback'}
        </Button>
      </Form>
    </>
  );
};

export default FeedbackForm;
