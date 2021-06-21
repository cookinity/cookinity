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
        formik.setFieldValue('overallrankingstars', _.get(originalClass, 'overallrankingstars'));
        formik.setFieldValue('overallranking', _.get(originalClass, 'overallranking'));

        formik.setFieldValue('hostrankingstars', _.get(originalClass, 'hostrankingstars'));
        formik.setFieldValue('hostranking', _.get(originalClass, 'hostranking'));

        formik.setFieldValue('tasterankingstars', _.get(originalClass, 'tasterankingstars'));
        formik.setFieldValue('tasteranking', _.get(originalClass, 'tasteranking'));

        formik.setFieldValue('locationratingstars', _.get(originalClass, 'locationratingstars'));
        formik.setFieldValue('locationrating', _.get(originalClass, 'locationrating'));

        formik.setFieldValue('vtmrrankingstars', _.get(originalClass, 'vtmrrankingstars'));
        formik.setFieldValue('vtmrranking', _.get(originalClass, 'vtmrranking'));

        formik.setFieldValue('experiencerankingstars', _.get(originalClass, 'experiencerankingstars'));
        formik.setFieldValue('experienceranking', _.get(originalClass, 'experienceranking'));
    }, []);

    const formik = useFormik({
        initialValues: {
            overallrankingstars: '',
            overallranking: '',
            hostrankingstars: '',
            hostranking: '',
            tasterankingstars: '',
            tasteranking: '',
            locationratingstars: '',
            locationrating: '',
            vtmrrankingstars: '',
            vtmrranking: '',
            experiencerankingstars: '',
            experienceranking: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            const submit = async () => {
                try {
                    const {
                        overallrankingstars,
                        overallranking,
                        hostrankingstars,
                        hostranking,
                        tasterankingstars,
                        tasteranking,
                        locationratingstars,
                        locationrating,
                        vtmrrankingstars,
                        vtmrranking,
                        experiencerankingstars,
                        experienceranking,
                    } = values;
                    const data = {
                        overallrankingstars,
                        overallranking,
                        hostrankingstars,
                        hostranking,
                        tasterankingstars,
                        tasteranking,
                        locationratingstars,
                        locationrating,
                        vtmrrankingstars,
                        vtmrranking,
                        experiencerankingstars,
                        experienceranking,
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
                    //history.push('/hostmanagement');
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
