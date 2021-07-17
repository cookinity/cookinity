import Layout from 'components/Layout/Layout';
import React, { useState } from 'react';
import { compose } from 'redux';
import requireAuth from '../../higherOrderComponents/requireAuth';

import axios from 'axios';
import { useSelector } from 'react-redux';
import ClassForm from 'components/ClassForm/ClassForm';
import { Alert, Col, Row } from 'react-bootstrap';
import Loader from 'components/Shared/Loader/Loader';

const CreateClass = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [classCreated, setClassCreated] = useState(false);
  // @ts-ignore
  const auth = useSelector((state) => state.auth);

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setIsError(false);
    try {
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

      const city = formData.get('meetingAddress[city]');
      const country = formData.get('meetingAddress[country]');
      const postalcode = formData.get('meetingAddress[zip]');
      const state = formData.get('meetingAddress[state]');
      const street = formData.get('meetingAddress[street]');

      const result = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          format: 'json',
          city,
          country,
          state,
          postalcode,
          street,
        },
      });

      if (result.data.length === 0) {
        throw new Error('We could not verify the address you have entered!');
      }

      formData.append('lat', result.data[0].lat);
      formData.append('lon', result.data[0].lon);

      await axios.post('/api/classes', formData, config);
      setIsLoading(false);
      setClassCreated(true);
      return Promise.resolve(); // tell the form that there was not an error during submitting --> reset form
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
      setIsLoading(false);
      return Promise.reject(); // tell the form that there was a error during submitting --> do not reset form
    }
  };

  return (
    <Layout>
      <Row>
        <Col>
          {' '}
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
            <div style={{ display: isLoading ? 'block' : 'none' }}>
              <Loader></Loader>
            </div>
            <div style={{ display: isLoading ? 'none' : 'block' }}>
              <ClassForm
                submitCallback={onSubmit}
                isEditMode={false}
                originalClass={undefined}
              ></ClassForm>
            </div>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default compose(requireAuth)(CreateClass);
