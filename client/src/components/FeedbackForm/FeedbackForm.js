import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { validationSchema } from './feedbackValidation';
import { DateObject } from 'react-multi-date-picker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';
import BasicInfoSection from './FormSections/BasicInfoSection';
dayjs.extend(utc);

const FeedbackForm = ({ submitCallback, isEditMode, originalClass }) => {
    const history = useHistory();

    useEffect(() => {
        formik.setFieldValue('overallRatingStars', _.get(originalClass, 'overallRatingStars'));
        formik.setFieldValue('overallRating', _.get(originalClass, 'overallRating'));

        formik.setFieldValue('hostRatingStars', _.get(originalClass, 'hostRatingStars'));
        formik.setFieldValue('hostRating', _.get(originalClass, 'hostRating'));

        formik.setFieldValue('tasteRatingStars', _.get(originalClass, 'tasteRatingStars'));
        formik.setFieldValue('tasteRating', _.get(originalClass, 'tasteRating'));

        formik.setFieldValue('locationRatingStars', _.get(originalClass, 'locationRatingStars'));
        formik.setFieldValue('locationRating', _.get(originalClass, 'locationRating'));

        formik.setFieldValue('vtmrRatingStars', _.get(originalClass, 'vtmrRatingStars'));
        formik.setFieldValue('vtmrRating', _.get(originalClass, 'vtmrRating'));

        formik.setFieldValue('experienceRatingStars', _.get(originalClass, 'experienceRatingStars'));
        formik.setFieldValue('experienceRating', _.get(originalClass, 'experienceRating'));
    }, []);

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
                    const data = {
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

                    const formData = new FormData();
                    for (let dataKey in data) {
                        if (dataKey === 'meetingAddress') {
                            // append nested object
                            for (let addressKey in data[dataKey]) {
                                formData.append(`meetingAddress[${addressKey}]`, data[dataKey][addressKey]);
                            }
                        } else {
                            formData.append(dataKey, data[dataKey]);
                        }
                    }
                    // calling submit callback from parent component
                    await submitCallback(formData);
                    resetForm();
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
            <Form
                className="mx-auto"
                onSubmit={formik.handleSubmit}
                noValidate
                encType="multipart/form-data"
            >
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
