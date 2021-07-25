import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import _ from 'lodash';
import BasicInfoSection from './FormSections/BasicInfoSectionHost';

const FeedbackForm = ({ submitCallback, setIsError, setErrorMessage }) => {
  const history = useHistory();

  //Stars
  const [numberOfStars, setRatingNumberOfStars] = useState(0);

  const formik = useFormik({
    initialValues: {
      ratingCustomer: '',
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const submit = async () => {
        try {
          const {} = values;
          const newFeedbackGuest = {
            numberOfStars: numberOfStars,
          };
          //Error
          if (numberOfStars === 0) {
            setIsError(true);
            setErrorMessage('You must give a rating');
            return;
          }
          // calling submit callback from parent component
          await submitCallback(newFeedbackGuest);
          resetForm();
          history.push('/hostmanagement/booked-classes');
        } catch (err) {
          // error happened in parent component --> do not clear form
        }
      };
      submit();
    },
  });

  return (
    <>
      {<h1 className="text-center">Please Rate The Guest of Your Class</h1>}
      <Form className="mx-auto" onSubmit={formik.handleSubmit} noValidate>
        <BasicInfoSection
          formik={formik}
          setRatingNumberOfStars={setRatingNumberOfStars}
          numberOfStars={numberOfStars}
        ></BasicInfoSection>
        <hr></hr>
        <div className="text-center">
          <Button variant="primary" type="submit">
            {'Submit Feedback'}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default FeedbackForm;
