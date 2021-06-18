import Layout from 'components/Layout/Layout';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Alert, Col, Row } from 'react-bootstrap';
import Loader from 'components/Shared/Loader/Loader';
import { useSelector } from 'react-redux';
import FeedbackForm from 'components/FeedbackForm/FeedbackForm';

const FeedbackUser = () => {
  const [c, setClass] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackCreated, setFeedbackCreated] = useState(false);
  // @ts-ignore
  const auth = useSelector((state) => state.auth);
  // id of the class in the route
  // @ts-ignore
  let { classId } = useParams();


  const onSubmitFeedback = async () => {
    setIsError(false);
    setIsLoading(true);
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

      await axios.post('/api/feedback', config);
      setIsLoading(false);
      setFeedbackCreated(true);
      return Promise.resolve(); // tell the form that there was not an error during submitting --> reset form
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
      setIsLoading(false);
      return Promise.reject(); // tell the form that there was a error during submitting --> do not reset form
    }
  };

  if (c) {
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
              {feedbackCreated && (
                <Alert
                  variant="success"
                  onClose={() => {
                    setFeedbackCreated(false);
                  }}
                  dismissible
                >
                  {' '}
                  Feedback created!
                </Alert>
              )}
              <div style={{ display: isLoading ? 'block' : 'none' }}>
                <Loader></Loader>
              </div>
              <div style={{ display: isLoading ? 'none' : 'block' }}>
                <Row> Test </Row>
                <p></p>
                <FeedbackForm
                  submitCallback={FeedbackUser}
                  isEditMode={false}
                  originalClass={undefined}
                ></FeedbackForm>
              </div>
            </div>
          </Col>
        </Row>
      </Layout>
    );
  } else {
    return <div>Feedback not found!</div>;
  }
};

export default FeedbackUser;
