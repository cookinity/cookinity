import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../Layout/Layout';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import Loader from 'components/Shared/Loader/Loader';
import requireAuth from 'higherOrderComponents/requireAuth';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { ClassesTable } from './ClassesTable';


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
      // load all classes  which the currently logged in user booked
      //muss noch angepasst werden
      const result = await axios.get('/api/classes', { params: { hostId: auth.me.id } });
      const unformattedClasses = result.data.classes;

      //Divide bookings into past and future bookings
      const today = dayjs(new Date());
      const pastClasses = [];
      const futureClasses = [];

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
          futureClasses.push(cCopy);
        } else {
          pastClasses.push(cCopy);
        }
      });

      //Set of past and future bookings
      setUpcomingClasses(futureClasses);
      setPastClasses(pastClasses);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
    }
    setIsLoading(false);
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
              <h1 className="text-center">Your Bookings</h1>
              <p className="text-center"  >On this page all of your bookings a listed. Your are able to give feedback for past courses.</p>
              <h1 className="text-center">Booked Classes</h1>
              <ClassesTable
                classes={upcomingClasses}
              ></ClassesTable>
              <hr></hr>
              <h1 className="text-center">Past Classes</h1>
              <ClassesTable
                classes={pastClasses}
              ></ClassesTable>
            </div>
          </Col>
        </Row>
      </Layout>
    );
  }
};

export default compose(requireAuth)(HostManagement);