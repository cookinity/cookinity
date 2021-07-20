import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { validationSchema } from './classValidation';
import _ from 'lodash';
import AddressSection from './FormSections/AddressSection';
import EatingHabitsSection from './FormSections/EatingHabitsSection';
import PhotosSection from './FormSections/PhotosSection';
import DatesSection from './FormSections/DatesSection';
import GuestsSection from './FormSections/GuestsSection';
import BasicInfoSection from './FormSections/BasicInfoSection';
import PrivacyDetailsSection from './FormSections/PrivacyDetailsSection';

const ClassForm = ({ submitCallback, isEditMode, originalClass }) => {
  const history = useHistory();
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
      formik.setFieldValue('toBring', _.get(originalClass, 'toBring'));
      formik.setFieldValue('country', _.get(originalClass, 'meetingAddress.country'));
      formik.setFieldValue('city', _.get(originalClass, 'meetingAddress.city'));
      formik.setFieldValue('state', _.get(originalClass, 'meetingAddress.state'));
      formik.setFieldValue('zip', _.get(originalClass, 'meetingAddress.zip'));
      formik.setFieldValue('street', _.get(originalClass, 'meetingAddress.street'));
      formik.setFieldValue('pricePerPerson', _.get(originalClass, 'pricePerPerson'));
      formik.setFieldValue('durationInMinutes', _.get(originalClass, 'durationInMinutes'));
      formik.setFieldValue(
        'minGuestRatingRequired',
        _.get(originalClass, 'minGuestRatingRequired'),
      );
      formik.setFieldValue('minGuests', _.get(originalClass, 'minGuests'));
      formik.setFieldValue('maxGuests', _.get(originalClass, 'maxGuests'));
      formik.setFieldValue('veganFriendly', _.get(originalClass, 'veganFriendly'));
      formik.setFieldValue('vegetarianFriendly', _.get(originalClass, 'vegetarianFriendly'));
      formik.setFieldValue('nutAllergyFriendly', _.get(originalClass, 'nutAllergyFriendly'));
      formik.setFieldValue('pescatarianFriendly', _.get(originalClass, 'pescatarianFriendly'));
      formik.setFieldValue('eggFree', _.get(originalClass, 'eggFree'));
      formik.setFieldValue('soyFree', _.get(originalClass, 'soyFree'));
      formik.setFieldValue('privacyDetails', _.get(originalClass, 'privacyDetails'));

      if (_.get(originalClass, 'coverPhoto')) {
        const coverPhotoURL = _.get(originalClass, 'coverPhoto');
        setCoverPhotoUrl(coverPhotoURL);
      }

      if (_.get(originalClass, 'photoOne')) {
        const photoOneUrl = _.get(originalClass, 'photoOne');
        setPhotoOneUrl(photoOneUrl);
      }

      if (_.get(originalClass, 'photoTwo')) {
        const photoTwoUrl = _.get(originalClass, 'photoTwo');
        setPhotoTwoUrl(photoTwoUrl);
      }
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
      minGuestRatingRequired: 0,
      coverPhoto: null,
      photoOne: null,
      photoTwo: null,
      veganFriendly: false,
      vegetarianFriendly: false,
      nutAllergyFriendly: false,
      pescatarianFriendly: false,
      eggFree: false,
      soyFree: false,
      privacyDetails: '',
    },
    validationSchema: validationSchema,
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
            minGuestRatingRequired,
            minGuests,
            maxGuests,
            coverPhoto,
            photoOne,
            photoTwo,
            veganFriendly,
            vegetarianFriendly,
            nutAllergyFriendly,
            pescatarianFriendly,
            eggFree,
            soyFree,
            privacyDetails,
          } = values;
          const data = {
            title,
            category,
            pricePerPerson,
            durationInMinutes,
            minGuestRatingRequired,
            minGuests,
            maxGuests,
            description,
            toBring,
            veganFriendly,
            vegetarianFriendly,
            nutAllergyFriendly,
            pescatarianFriendly,
            eggFree,
            soyFree,
            privacyDetails,
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

          // calling submit callback from parent component
          await submitCallback(formData);
          resetForm();
          setCoverPhoto(null);
          setCoverPhotoUrl(null);
          setPhotoOne(null);
          setPhotoOneUrl(null);
          setPhotoTwo(null);
          setPhotoTwoUrl(null);
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
      {isEditMode ? <h1>Edit a Cooking Class</h1> : <h1>Host A New Cooking Class</h1>}
      <Form
        className="mx-auto"
        onSubmit={formik.handleSubmit}
        noValidate
        encType="multipart/form-data"
      >
        <BasicInfoSection formik={formik}></BasicInfoSection>
        <hr></hr>
        <GuestsSection formik={formik}></GuestsSection>
        <hr></hr>
        <AddressSection formik={formik}></AddressSection>
        <hr></hr>
        <PrivacyDetailsSection formik={formik}></PrivacyDetailsSection>
        <hr></hr>
        <DatesSection formik={formik}></DatesSection>
        <hr></hr>
        <EatingHabitsSection formik={formik}></EatingHabitsSection>
        <hr></hr>
        <PhotosSection
          formik={formik}
          coverPhoto={coverPhoto}
          coverPhotoUrl={coverPhotoUrl}
          onCoverPhotoChange={onCoverPhotoChange}
          photoOne={photoOne}
          photoOneUrl={photoOneUrl}
          onPhotoOneChange={onPhotoOneChange}
          photoTwo={photoTwo}
          photoTwoUrl={photoTwoUrl}
          onPhotoTwoChange={onPhotoTwoChange}
        ></PhotosSection>
        <hr></hr>
        <Button variant="primary" type="submit">
          {isEditMode ? 'Edit Class' : 'Create Class'}
        </Button>
      </Form>
    </>
  );
};

export default ClassForm;
