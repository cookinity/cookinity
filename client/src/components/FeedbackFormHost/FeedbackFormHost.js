import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { validationSchema } from './feedbackValidationHost';
import _ from 'lodash';
import BasicInfoSection from './FormSections/BasicInfoSectionHost';

const FeedbackForm = ({ submitCallback, setIsError, setErrorMessage }) => {
  const history = useHistory();

  //Stars
  const [ratingCustomerStar, setRatingCustomerStar] = useState(0);

  const formik = useFormik({
    initialValues: {
      ratingCustomer: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const submit = async () => {

        try {
          const {
            ratingCustomer,
          } = values;
          const newFeedbackHost = {
            ratingCustomerStar: ratingCustomerStar,
            ratingCustomer,
          };
          //Error
          if (ratingCustomerStar === 0) {
            setIsError(true);
            setErrorMessage("You must give a rating");
            return;
          }
          // calling submit callback from parent component
          await submitCallback(newFeedbackHost);
          resetForm();
          history.push('/booked-classes');
        } catch (err) {
          // error happened in parent component --> do not clear form
        }
      };
      submit();
    },
  });

  return (
    <>
      {<h1 className="text-center">Feedback for the Customer</h1>}
      <Form className="mx-auto" onSubmit={formik.handleSubmit} noValidate>
        <BasicInfoSection formik={formik}
          setRatingCustomerStar={setRatingCustomerStar} ratingCustomerStar={ratingCustomerStar}
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
