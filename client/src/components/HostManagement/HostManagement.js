import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Layout from '../Layout/Layout';
import { Alert, Button, Col, Row } from 'react-bootstrap';

import Loader from 'components/Shared/Loader/Loader';
import requireAuth from 'higherOrderComponents/requireAuth';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { ClassesTable } from './ClassesTable';
import { LinkContainer } from 'react-router-bootstrap';
dayjs.extend(utc);
dayjs.extend(localizedFormat);

export const HostManagement = () => {
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      // load all classes for which the currently logged in user is host
      const result = await axios.get('/api/classes', { params: { hostId: auth.me.id } });
      const unformattedClasses = result.data.classes;
      const today = dayjs(new Date());
      const classesWithAFutureDate = [];
      const classesWihoutAFutureDate = [];
      unformattedClasses.forEach((c) => {
        const cCopy = { ...c };
        cCopy.pastDates = [];
        cCopy.futureDates = [];

        for (const ts of cCopy.timeSlots) {
          const date = dayjs(ts.date);
          if (date.isBefore(today)) {
            cCopy.pastDates.push(date.format('llll'));
          } else {
            cCopy.futureDates.push(date.format('llll'));
          }
        }
        if (cCopy.futureDates.length !== 0) {
          classesWithAFutureDate.push(cCopy);
        } else {
          classesWihoutAFutureDate.push(cCopy);
        }
      });

      setUpcomingClasses(classesWithAFutureDate);
      setPastClasses(classesWihoutAFutureDate);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
    }
    setIsLoading(false);
  };

  const deleteClass = async (c) => {
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

      await axios.delete(`/api/classes/${c.id}`, config);
      setIsLoading(false);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
      setIsLoading(false);
    }
  };

  const onDeleteCallback = (c) => {
    return async () => {
      await deleteClass(c);
      await fetchClasses();
    };
  };

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
            <div>
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
              <LinkContainer to={`/hostmanagement/create-class`}>
                <Button variant="success" className="mt-2">
                  <FontAwesomeIcon icon={faPlus} /> Create a new class
                </Button>
              </LinkContainer>

              <h1 className="text-center">Upcoming Classes</h1>
              <ClassesTable
                classes={upcomingClasses}
                onDeleteCallback={onDeleteCallback}
              ></ClassesTable>
              <hr></hr>
              <h1 className="text-center">Past Classes</h1>
              <ClassesTable
                classes={pastClasses}
                onDeleteCallback={onDeleteCallback}
              ></ClassesTable>
            </div>
          </Col>
        </Row>
      </Layout>
    );
  }
};

export default compose(requireAuth)(HostManagement);
