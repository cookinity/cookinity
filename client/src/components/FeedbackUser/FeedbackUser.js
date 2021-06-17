import Layout from 'components/Layout/Layout';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { Alert, Card, Col, Row } from 'react-bootstrap';
import Loader from 'components/Shared/Loader/Loader';
import ClassForm from 'components/FeedbackForm/FeedbackForm';

function parseDate(dates) {
  return dates.map((d) => dayjs(d));
}

const FeedbackUser = () => {
  const [c, setClass] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackCreated, setFeedbackCreated] = useState(false);

  // id of the class in the route
  // @ts-ignore
  let { classId } = useParams();

  useEffect(() => {
    const fetchClass = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const result = await axios(`/api/classes/${classId}`);
        result.data.class.bookableDates = parseDate(result.data.class.bookableDates);
        setClass(result.data.class);
      } catch (err) {
        setIsError(true);
        setErrorMessage(err?.response?.data.message || err.message);
      }
      setIsLoading(false);
    };
    fetchClass();
  }, []);

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
                  Class created!
                </Alert>
              )}
              <div style={{ display: isLoading ? 'block' : 'none' }}>
                <Loader></Loader>
              </div>
              <div style={{ display: isLoading ? 'none' : 'block' }}>
                <ClassForm
                  submitCallback={FeedbackUser}
                  isEditMode={false}
                  originalClass={undefined}
                ></ClassForm>
              </div>
            </div>
          </Col>
        </Row>
      </Layout>
    );
  } else {
    return <div>Class not found!</div>;
  }
};

export default FeedbackUser;
