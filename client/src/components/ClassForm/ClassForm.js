import React, { useEffect, useState } from 'react';
import { Button, Col, Form, FormControl, InputGroup } from 'react-bootstrap';
import { CLASS_CATEGORIES } from '../../constants/ClassCategories';

import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { validationSchema } from './classValidation';
import { Calendar, DateObject } from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import ImageUpload from './ImageUpload';
import _ from 'lodash';
dayjs.extend(utc);

const ClassForm = ({ submitCallback, isEditMode, originalClass }) => {
  const [bookableDates, setBookableDates] = useState([]);
  const [focusedDate, setFocusedDate] = useState();
  // coverPhoto
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(null);
  // photoOne
  const [photoOne, setPhotoOne] = useState(null);
  const [photoOneUrl, setPhotoOneUrl] = useState(null);
  // photoTwo
  const [photoTwo, setPhotoTwo] = useState(null);
  const [photoTwoUrl, setPhotoTwoUrl] = useState(null);

  const onCoverPhotoChange = (event) => {
    if (event.target.files.length !== 0) {
      formik.setFieldValue('coverPhoto', event.currentTarget.files[0]);
      setCoverPhotoUrl(URL.createObjectURL(event.target.files[0]));
      setCoverPhoto(event.target.files[0]);
    }
  };

  const onPhotoOneChange = (event) => {
    if (event.target.files.length !== 0) {
      formik.setFieldValue('photoOne', event.currentTarget.files[0]);
      setPhotoOneUrl(URL.createObjectURL(event.target.files[0]));
      setPhotoOne(event.target.files[0]);
    }
  };

  const onPhotoTwoChange = (event) => {
    if (event.target.files.length !== 0) {
      formik.setFieldValue('photoTwo', event.currentTarget.files[0]);
      setPhotoTwoUrl(URL.createObjectURL(event.target.files[0]));
      setPhotoTwo(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (isEditMode && originalClass) {
      formik.setFieldValue('title', _.get(originalClass, 'title'));
      formik.setFieldValue('category', _.get(originalClass, 'category'));
      formik.setFieldValue('description', _.get(originalClass, 'description'));
      formik.setFieldValue('country', _.get(originalClass, 'meetingAddress.country'));
      formik.setFieldValue('city', _.get(originalClass, 'meetingAddress.city'));
      formik.setFieldValue('state', _.get(originalClass, 'meetingAddress.state'));
      formik.setFieldValue('zip', _.get(originalClass, 'meetingAddress.zip'));
      formik.setFieldValue('street', _.get(originalClass, 'meetingAddress.street'));
      formik.setFieldValue('pricePerPerson', _.get(originalClass, 'pricePerPerson'));
      formik.setFieldValue('minGuests', _.get(originalClass, 'minGuests'));
      formik.setFieldValue('maxGuests', _.get(originalClass, 'maxGuests'));
      const bookableDates = [];
      for (const date of _.get(originalClass, 'bookableDates')) {
        const dateObject = new DateObject(dayjs(date).toDate());
        bookableDates.push(dateObject);
      }
      setBookableDates(bookableDates);

      if (_.get(originalClass, 'coverPhoto')) {
        const coverPhotoURL = _.get(originalClass, 'coverPhoto');
        setCoverPhotoUrl(coverPhotoURL);
      }
    }
  }, []);

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
      pricePerPerson: undefined,
      minGuests: undefined,
      maxGuests: undefined,
      coverPhoto: null,
      photoOne: null,
      photoTwo: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const submit = async () => {
        try {
          const {
            title,
            category,
            description,
            country,
            city,
            zip,
            state,
            street,
            pricePerPerson,
            minGuests,
            maxGuests,
            coverPhoto,
            photoOne,
            photoTwo,
          } = values;
          const data = {
            title,
            category,
            pricePerPerson,
            minGuests,
            maxGuests,
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
          const photos = [coverPhoto, photoOne, photoTwo];
          for (const photo of photos) {
            formData.append('photos[]', photo);
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
          setCoverPhoto(null);
          setCoverPhotoUrl(null);
          setPhotoOne(null);
          setPhotoOneUrl(null);
          setPhotoTwo(null);
          setPhotoTwoUrl(null);
          setBookableDates([]);
          setFocusedDate(undefined);
        } catch (err) {
          // error happened in parent component --> do not clear form
        }
      };
      submit();
    },
  });

  const classCategories = CLASS_CATEGORIES.map((category) => {
    return <option key={category}>{category}</option>;
  });

  return (
    <>
      {isEditMode ? <h1>Edit a Cooking Class</h1> : <h1>Host A New Cooking Class</h1>}
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
        <Form.Row>
          <Form.Group as={Col} controlId="pricePerPerson">
            <Form.Label>Price Per Person</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="50,00"
                name="pricePerPerson"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.pricePerPerson}
                className={
                  formik.touched.pricePerPerson && formik.errors.pricePerPerson
                    ? 'form-error'
                    : null
                }
              />
              <InputGroup.Append>
                <InputGroup.Text>€</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            {formik.touched.pricePerPerson && formik.errors.pricePerPerson ? (
              <div className="form-error-message">{formik.errors.pricePerPerson}</div>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} controlId="minGuests">
            <Form.Label>Minimum Number of Guests</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="1"
                name="minGuests"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.minGuests}
                className={
                  formik.touched.minGuests && formik.errors.minGuests ? 'form-error' : null
                }
              />
              <InputGroup.Append>
                <InputGroup.Text>Guests</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            {formik.touched.minGuests && formik.errors.minGuests ? (
              <div className="form-error-message">{formik.errors.minGuests}</div>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} controlId="maxGuests">
            <Form.Label>Maximum Number of Guests</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="1"
                name="maxGuests"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.maxGuests}
                className={
                  formik.touched.maxGuests && formik.errors.maxGuests ? 'form-error' : null
                }
              />
              <InputGroup.Append>
                <InputGroup.Text>Guests</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            {formik.touched.maxGuests && formik.errors.maxGuests ? (
              <div className="form-error-message">{formik.errors.maxGuests}</div>
            ) : null}
          </Form.Group>
        </Form.Row>
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
          <Form.Label>Choose Dates for Which Your Class Can be Booked</Form.Label>
          <Calendar
            className="mx-auto"
            format="DD/MM/YYYY HH:mm"
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

        <Form.Row>
          <Col sm={12} md={4}>
            <Form.Group>
              <Form.Label>Choose a Cover Photo For Your Class</Form.Label>
              <ImageUpload
                id="coverPhoto"
                onImageChange={onCoverPhotoChange}
                image={coverPhoto}
                imageUrl={coverPhotoUrl}
              ></ImageUpload>
              {formik.touched.coverPhoto && formik.errors.coverPhoto ? (
                <div className="form-error-message">{formik.errors.coverPhoto}</div>
              ) : null}
            </Form.Group>
          </Col>
          <Col sm={12} md={4}>
            <Form.Group>
              <Form.Label>Choose an Additional Photo</Form.Label>
              <ImageUpload
                id="photoOne"
                onImageChange={onPhotoOneChange}
                image={photoOne}
                imageUrl={photoOneUrl}
              ></ImageUpload>
              {formik.touched.photoOne && formik.errors.photoOne ? (
                <div className="form-error-message">{formik.errors.photoOne}</div>
              ) : null}
            </Form.Group>
          </Col>
          <Col sm={12} md={4}>
            <Form.Group>
              <Form.Label>Choose an Additional Photo</Form.Label>
              <ImageUpload
                id="photoTwo"
                onImageChange={onPhotoTwoChange}
                image={photoTwo}
                imageUrl={photoTwoUrl}
              ></ImageUpload>
              {formik.touched.photoTwo && formik.errors.photoTwo ? (
                <div className="form-error-message">{formik.errors.photoTwo}</div>
              ) : null}
            </Form.Group>
          </Col>
        </Form.Row>
        <hr></hr>
        <Button variant="primary" type="submit">
          {isEditMode ? 'Edit Class' : 'Create Class'}
        </Button>
      </Form>
    </>
  );
};

export default ClassForm;
