import axios from 'axios';
import { TimeSlotTable } from 'components/HostManagement/TimeManagement/TimeSlotTable';
import Layout from 'components/Layout/Layout';
import Loader from 'components/Shared/Loader/Loader';
import { isError } from 'holderjs';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { compose } from 'redux';
import requireAuth from '../../higherOrderComponents/requireAuth';

const BookClass = () => {
  const [c, setClass] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.auth);
  // id of the class in the route
  let { classId } = useParams();

  useEffect(() => {
    const fetchClass = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const result = await axios(`/api/classes/${classId}`);
        setClass(result.data.class);
      } catch (err) {
        setIsError(true);
        setErrorMessage(err?.response?.data.message || err.message);
      }
      setIsLoading(false);
    };
    fetchClass();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <Loader></Loader>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Row>
          <Col>
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
              <div>{c ? <>{c.title}</> : <div>No class found!</div>}</div>
            </div>
          </Col>
        </Row>
      </Layout>
    );
  }
};

export default compose(requireAuth)(BookClass);
