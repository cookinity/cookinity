import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { validationSchema } from './feedbackValidation';
import { DateObject } from 'react-multi-date-picker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';
import AddressSection from './FormSections/AddressSection';
import EatingHabitsSection from './FormSections/EatingHabitsSection';
import PhotosSection from './FormSections/PhotosSection';
import DatesSection from './FormSections/DatesSection';
import GuestsSection from './FormSections/GuestsSection';
import BasicInfoSection from './FormSections/BasicInfoSection';
dayjs.extend(utc);

const FeedbackForm = ({ submitCallback, isEditMode, originalClass }) => {
    const history = useHistory();

    const [bookableDates, setBookableDates] = useState([]);
    const [focusedDate, setFocusedDate] = useState();

    useEffect(() => {
        if (isEditMode && originalClass) {
            formik.setFieldValue('title', _.get(originalClass, 'title'));
            formik.setFieldValue('category', _.get(originalClass, 'category'));
            formik.setFieldValue('description', _.get(originalClass, 'description'));
            formik.setFieldValue('toBring', _.get(originalClass, 'toBring'));
            formik.setFieldValue('country', _.get(originalClass, 'meetingAddress.country'));
            formik.setFieldValue('city', _.get(originalClass, 'meetingAddress.city'));
            formik.setFieldValue('state', _.get(originalClass, 'meetingAddress.state'));
            formik.setFieldValue('zip', _.get(originalClass, 'meetingAddress.zip'));
            formik.setFieldValue('street', _.get(originalClass, 'meetingAddress.street'));
            formik.setFieldValue('pricePerPerson', _.get(originalClass, 'pricePerPerson'));
            formik.setFieldValue('durationInMinutes', _.get(originalClass, 'durationInMinutes'));
            formik.setFieldValue('minGuests', _.get(originalClass, 'minGuests'));
            formik.setFieldValue('maxGuests', _.get(originalClass, 'maxGuests'));
            formik.setFieldValue('veganFriendly', _.get(originalClass, 'veganFriendly'));
            formik.setFieldValue('vegetarianFriendly', _.get(originalClass, 'vegetarianFriendly'));
            formik.setFieldValue('nutAllergyFriendly', _.get(originalClass, 'nutAllergyFriendly'));

            const bookableDates = [];
            for (const date of _.get(originalClass, 'bookableDates')) {
                const dateObject = new DateObject(dayjs(date).toDate());
                bookableDates.push(dateObject);
            }
            setBookableDates(bookableDates);

        }
    }, []);

    const formik = useFormik({
        initialValues: {
            title: '',
            category: 'Asian',
            description: '',
            toBring: '',
            country: '',
            city: '',
            state: '',
            zip: '',
            street: '',
            pricePerPerson: '',
            durationInMinutes: '',
            minGuests: '',
            maxGuests: '',
            coverPhoto: null,
            photoOne: null,
            photoTwo: null,
            veganFriendly: false,
            vegetarianFriendly: false,
            nutAllergyFriendly: false,
        },
        //validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            const submit = async () => {
                try {
                    const {
                        title,
                        category,
                        description,
                        toBring,
                        country,
                        city,
                        zip,
                        state,
                        street,
                        pricePerPerson,
                        durationInMinutes,
                        minGuests,
                        maxGuests,
                        coverPhoto,
                        photoOne,
                        photoTwo,
                        veganFriendly,
                        vegetarianFriendly,
                        nutAllergyFriendly,
                    } = values;
                    const data = {
                        title,
                        category,
                        pricePerPerson,
                        durationInMinutes,
                        minGuests,
                        maxGuests,
                        description,
                        toBring,
                        veganFriendly,
                        vegetarianFriendly,
                        nutAllergyFriendly,
                        meetingAddress: {
                            country,
                            city,
                            zip,
                            state,
                            street,
                        },
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
                    if (coverPhoto) {
                        formData.append('coverPhoto', coverPhoto);
                    }
                    if (photoOne) {
                        formData.append('photoOne', photoOne);
                    }

                    if (photoTwo) {
                        formData.append('photoTwo', photoTwo);
                    }

                    // We convert to UTC before sending the dates to the backend
                    formData.append(
                        'bookableDates',
                        JSON.stringify(
                            bookableDates.map((dateObject) => dayjs(dateObject.toDate()).utc().toJSON()),
                        ),
                    );
                    // calling submit callback from parent component
                    await submitCallback(formData);
                    resetForm();
                    setBookableDates([]);
                    setFocusedDate(undefined);
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
