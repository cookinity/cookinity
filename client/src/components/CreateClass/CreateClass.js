import Layout from 'components/Layout/Layout';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { Alert, Button, Col, Form } from 'react-bootstrap';
import { compose } from 'redux';
import requireAuth from '../../higherOrderComponents/requireAuth';
import { CLASS_CATEGORIES } from './ClassCategories';

import { useFormik } from 'formik';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { Calendar } from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  category: Yup.string().required('Category is required'),
  description: Yup.string().required('Description is required'),
  country: Yup.string().required('Country is required'),
  city: Yup.string().required('City is required'),
  zip: Yup.string().required('Zip Code is required'),
  state: Yup.string().required('State is required'),
  street: Yup.string().required('Street is required'),
});

const CreateClass = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [classCreated, setClassCreated] = useState(false);
  const [bookableDates, setBookableDates] = useState([]);
  const [focusedDate, setFocusedDate] = useState();
  const [coverPhoto, setCoverPhoto] = useState(null);

  const auth = useSelector((state) => state.auth);

  const onCoverPhotoChange = (event) => {
    formik.setFieldValue('coverPhoto', event.currentTarget.files[0]);
    setCoverPhoto(event.target.files[0]);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      category: 'Asian',
      description: '',
      country: '',
      city: '',
      state: '',
      zip: '',
      street: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const submit = async () => {
        setSubmitting(true);
        setIsError(false);
        try {
          const { title, category, description, country, city, zip, state, street } = values;
          const data = {
            title,
            category,
            description,
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
          // We convert to UTC before sending the dates to the backend
          formData.append(
            'bookableDates',
            JSON.stringify(
              bookableDates.map((dateObject) => dayjs(dateObject.toDate()).utc().toJSON()),
            ),
          );
          // Adding the cover photo
          formData.append('coverPhoto', coverPhoto);
          // adding the necessary security header
          const token = auth.token;
          const config = {
            headers: {
              'Content-type': 'application/json',
            },
          };
          if (token) {
            config.headers['x-auth-token'] = token;
          }

          await axios.post('/api/classes', formData, config);
          resetForm();
          setBookableDates([]);
          setFocusedDate(undefined);
          setClassCreated(true);
        } catch (err) {
          setIsError(true);
          setErrorMessage(err?.response?.data.message || err.message);
        }
        setSubmitting(false);
      };
      submit();
    },
  });

  const classCategories = CLASS_CATEGORIES.map((category) => {
    return <option>{category}</option>;
  });

  return (
    <Layout>
      <div className="mt-2">
        {isError && (
          <Alert
            variant="danger"
            onClose={() => {
              setIsError(false);
              setErrorMessage('');
            }}
            dismissible
          >
            {' '}
            {errorMessage}
          </Alert>
        )}
        {classCreated && (
          <Alert
            variant="success"
            onClose={() => {
              setClassCreated(false);
            }}
            dismissible
          >
            {' '}
            Class created!
          </Alert>
        )}
        <h1>Host A New Cooking Class</h1>
        <Form
          className="mx-auto"
          onSubmit={formik.handleSubmit}
          noValidate
          encType="multipart/form-data"
        >
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              placeholder="Title"
              name="title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              className={formik.touched.title && formik.errors.title ? 'form-error' : null}
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="form-error-message">{formik.errors.title}</div>
            ) : null}
          </Form.Group>
          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              name="category"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.category}
              className={formik.touched.category && formik.errors.category ? 'form-error' : null}
            >
              {classCategories}
            </Form.Control>
            {formik.touched.category && formik.errors.category ? (
              <div className="form-error-message">{formik.errors.category}</div>
            ) : null}
          </Form.Group>
          <hr></hr>
          <Form.Group controlId="description">
            <Form.Label>Class Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              className={
                formik.touched.description && formik.errors.description ? 'form-error' : null
              }
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="form-error-message">{formik.errors.description}</div>
            ) : null}
          </Form.Group>
          <hr></hr>
          <Form.Label>Public Meeting Address</Form.Label>

          <Form.Group controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              placeholder="Germany"
              name="country"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.country}
              className={formik.touched.country && formik.errors.country ? 'form-error' : null}
            />
            {formik.touched.country && formik.errors.country ? (
              <div className="form-error-message">{formik.errors.country}</div>
            ) : null}
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col} controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                placeholder="City"
                name="city"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}
                className={formik.touched.city && formik.errors.city ? 'form-error' : null}
              />
              {formik.touched.city && formik.errors.city ? (
                <div className="form-error-message">{formik.errors.city}</div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control
                placeholder="State"
                name="state"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.state}
                className={formik.touched.state && formik.errors.state ? 'form-error' : null}
              />
              {formik.touched.state && formik.errors.state ? (
                <div className="form-error-message">{formik.errors.state}</div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="zip">
              <Form.Label>Zip</Form.Label>
              <Form.Control
                placeholder="Zip"
                name="zip"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.zip}
                className={formik.touched.zip && formik.errors.zip ? 'form-error' : null}
              />
              {formik.touched.zip && formik.errors.zip ? (
                <div className="form-error-message">{formik.errors.zip}</div>
              ) : null}
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="street">
            <Form.Label>Street</Form.Label>
            <Form.Control
              placeholder="TastyStreet 11"
              name="street"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.street}
              className={formik.touched.street && formik.errors.street ? 'form-error' : null}
            />
            {formik.touched.street && formik.errors.street ? (
              <div className="form-error-message">{formik.errors.street}</div>
            ) : null}
          </Form.Group>
          <hr></hr>
          <Form.Group controlId="bookableDates">
            <Form.Label>Bookable Dates</Form.Label>
            <Calendar
              format="DD/MM/YYYY HH:mm"
              minDate={new Date()}
              plugins={[
                <DatePanel
                  sort="date"
                  position="bottom"
                  header="Bookable Dates"
                  markFocused
                  focusedClassName="bg-green"
                />,
                <TimePicker hideSeconds position="right" />,
              ]}
              multiple
              sort
              onFocusedDateChange={setFocusedDate}
              onClose={() => setFocusedDate(undefined)}
              weekStartDayIndex={1}
              value={bookableDates}
              onChange={setBookableDates}
              mapDays={({ date, isSameDate }) => {
                let props = {};

                if (!isSameDate(date, focusedDate)) return;

                props.style = { backgroundColor: 'green' };

                return props;
              }}
            />
          </Form.Group>
          <hr></hr>
          <Form.Group>
            <Form.Control
              type="file"
              name="coverPhoto"
              onChange={onCoverPhotoChange}
            ></Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Create Class
          </Button>
        </Form>
      </div>
    </Layout>
  );
};

export default compose(requireAuth)(CreateClass);
