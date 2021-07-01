import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { validationSchema } from './feedbackValidation';
import _ from 'lodash';
import BasicInfoSection from './FormSections/BasicInfoSection';

const FeedbackForm = ({ submitCallback, setIsError, setErrorMessage }) => {
  const history = useHistory();

  //Stars
  const [overallRatingStars, setRatingOverallRatingStars] = useState(0);
  const [hostRatingStars, setRatingHostStars] = useState(0);
  const [tasteRatingStars, setRatingTasteStars] = useState(0);
  const [locationRatingStars, setRatingLocationStars] = useState(0);
  const [vtmrRatingStars, setRatingVtmrStars] = useState(0);
  const [experienceRatingStars, setRatingExperienceStars] = useState(0);

  //ToDo: Discuss if we really want that much feedback. Maybe only stars and overall feedback?
  const formik = useFormik({
    initialValues: {
      overallRating: '',
      hostRating: '',
      tasteRating: '',
      locationRating: '',
      vtmrRating: '',
      experienceRating: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const submit = async () => {

        try {
          const {
            overallRating,
          } = values;
          const newFeedback = {
            overallRatingStars: overallRatingStars,
            hostRatingStars: hostRatingStars,
            tasteRatingStars: tasteRatingStars,
            locationRatingStars: locationRatingStars,
            vtmrRatingStars: vtmrRatingStars,
            experienceRatingStars: experienceRatingStars,
            overallRating,
          };
          //Error
          if (overallRatingStars === 0) {
            setIsError(true);
            setErrorMessage("You must give a rating in the Overall Section");
            return;
          }
          debugger;
          // calling submit callback from parent component
          await submitCallback(newFeedback);
          resetForm();
          history.push('/your-bookings');
        } catch (err) {
          // error happened in parent component --> do not clear form
        }
      };
      submit();
    },
  });

  return (
    <>
      {<h1 className="text-center">Feedback</h1>}
      <Form className="mx-auto" onSubmit={formik.handleSubmit} noValidate>
        <BasicInfoSection formik={formik}
          setRatingOverallRatingStars={setRatingOverallRatingStars} overallRatingStars={overallRatingStars}
          setRatingHostStars={setRatingHostStars} hostRatingStars={hostRatingStars}
          setRatingTasteStars={setRatingTasteStars} tasteRatingStars={tasteRatingStars}
          setRatingLocationStars={setRatingLocationStars} locationRatingStars={locationRatingStars}
          setRatingVtmrStars={setRatingVtmrStars} vtmrRatingStars={vtmrRatingStars}
          setRatingExperienceStars={setRatingExperienceStars} experienceRatingStars={experienceRatingStars}
        ></BasicInfoSection>
        <hr></hr>
        <Button variant="primary" type="submit">
          {'Submit Feedback'}
        </Button>
      </Form>
    </>
  );
};

export default FeedbackForm;
