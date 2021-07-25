import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Col, Row } from 'react-bootstrap';
import Loader from 'components/Shared/Loader/Loader';
import requireAuth from 'higherOrderComponents/requireAuth';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { ClassesTableYourBookings } from './ClassesTableYourBookings';
import { ClassesTablePastBookedClasses } from './ClassesTablePastBookedClasses';
import LayoutNarrow from 'components/Layout/LayoutNarrow';
import { useHistory } from 'react-router-dom';

export const YourBookings = () => {
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOrderDone, setIsOrderDone] = useState(false);
  // @ts-ignore
  const auth = useSelector((state) => state.auth);
  const history = useHistory();
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setIsOrderDone(true);
      history.push({
        pathname: '/your-bookings',
        search: '',
      });
    }
    if (query.get('canceled')) {
      setIsError(true);
      setErrorMessage('Order canceled');
      history.push({
        pathname: '/your-bookings',
        search: '',
      });
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
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
      // load all bookings for which the currently logged in user is the customer
      const result = await axios.get('/api/bookings/ascustomer', config);
      const unformattedBookings = result.data.bookings;
      setAllClasses(unformattedBookings);
      const classesBookedFuture = [];
      const classesBookedPast = [];
      const today = dayjs(new Date());
      unformattedBookings.forEach((b) => {
        const date = dayjs(b.bookedTimeSlot.date);
        if (date.isBefore(today)) {
          classesBookedPast.push(b);
        } else {
          classesBookedFuture.push(b);
        }
      });

      setUpcomingClasses(classesBookedFuture);
      setPastClasses(classesBookedPast);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
    }
    setIsLoading(false);
  };

  let content;

  if (allClasses && allClasses.length > 0) {
    content = (
      <>
        <h1 className="text-center">Upcoming</h1>
        <ClassesTableYourBookings yourbookings={upcomingClasses}></ClassesTableYourBookings>
        <hr></hr>
        <h1 className="text-center">Previous</h1>
        <ClassesTablePastBookedClasses yourbookings={pastClasses}></ClassesTablePastBookedClasses>
      </>
    );
  } else {
    content = <Alert variant="warning">😢 You have not booked a class yet!😢</Alert>;
  }

  if (isLoading) {
    return (
      <LayoutNarrow>
        <Loader></Loader>
      </LayoutNarrow>
    );
  } else {
    return (
      <LayoutNarrow>
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
              {isOrderDone && (
                <Alert variant="success" dismissible>
                  🎉Order confirmed!🎉 Please check if there is a "View Contact Details" Button in
                  the table. Then the host has some more information for you!
                </Alert>
              )}
              {content}
            </div>
          </Col>
        </Row>
      </LayoutNarrow>
    );
  }
};

export default compose(requireAuth)(YourBookings);
