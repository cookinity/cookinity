import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../Layout/Layout';
import { Accordion, Alert, Button, Card, Col, Nav, Row, Table } from 'react-bootstrap';

import Loader from 'components/Shared/Loader/Loader';
import requireAuth from 'higherOrderComponents/requireAuth';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { ClassesTable } from './ClassesTable';
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

          for (const dateString of cCopy.bookableDates) {
            const date = dayjs(dateString);
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

    fetchClasses();
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
              <h1 className="text-center">Upcoming Classes</h1>
              <ClassesTable classes={upcomingClasses}></ClassesTable>
              <hr></hr>
              <h1 className="text-center">Past Classes</h1>
              <ClassesTable classes={pastClasses}></ClassesTable>
            </div>
          </Col>
        </Row>
      </Layout>
    );
  }
};

export default compose(requireAuth)(HostManagement);
